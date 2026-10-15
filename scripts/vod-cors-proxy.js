#!/usr/bin/env node
/**
 * Media helper proxy for Samsung Tizen ISRTV:
 *  - /proxy   — CORS proxy for HLS/DASH (Kan VOD)
 *  - /frame   — JPEG still from a live/VOD stream via ffmpeg (live thumbnails)
 *  - /catalog — auto-update packages (manifest + series JSON + images)
 *  - /youtube — HTTP wrapper page for YouTube embeds (fixes Error 153 / missing Referer)
 *  - /tv4/play — TV4 Play resolve (Mac-side auth; bypasses TV WAF login)
 *
 * Usage: node scripts/vod-cors-proxy.js
 * Default: http://0.0.0.0:8791
 *
 * TV4 session (refresh when login expires):
 *   node scripts/tv4-login.js
 *
 * Build catalog packages:
 *   python3 scripts/catalog-updater.py
 */
'use strict';

var http = require('http');
var https = require('https');
var url = require('url');
var os = require('os');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var PORT = Number(process.env.VOD_PROXY_PORT || 8791);
var HOST = process.env.VOD_PROXY_HOST || '0.0.0.0';
var httpAgent = new http.Agent({ keepAlive: true, maxSockets: 8, keepAliveMsecs: 10000 });
var httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 8, keepAliveMsecs: 10000 });
var FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
var FRAME_DIR = path.join(os.tmpdir(), 'isrtv-frames');
var CATALOG_DIR = path.join(__dirname, 'catalog');
var TV4_SESSION_PATH = path.join(__dirname, '.tv4-session.json');
var TV4_AUTH_URL = 'https://auth.tv4.a2d.tv/v2/auth';
var TV4_CLIENT = 'tv4-web';
var tv4AccessCache = { token: null, expiry: 0 };
var activeFrames = 0;
var MAX_PARALLEL_FRAMES = 6;
var FRAME_TIMEOUT_MS = 8000;
var FRAME_CACHE_MS = 90000;
var frameWaiters = [];
var frameCache = Object.create(null);

try {
  fs.mkdirSync(FRAME_DIR, { recursive: true });
} catch (e) {}

function frameCacheKey(targetUrl) {
  return String(targetUrl || '').replace(/[?&](hdnea|hdntl|token|__hdnea__)=[^&]*/gi, '');
}

function getCachedFrame(targetUrl) {
  var key = frameCacheKey(targetUrl);
  var hit = frameCache[key];
  if (!hit || !hit.data || !hit.data.length) {
    return null;
  }
  if (Date.now() - hit.at > FRAME_CACHE_MS) {
    delete frameCache[key];
    return null;
  }
  return hit.data;
}

function setCachedFrame(targetUrl, data) {
  var key = frameCacheKey(targetUrl);
  if (!key || !data || !data.length) {
    return;
  }
  frameCache[key] = { data: data, at: Date.now() };
}

function lanIPv4() {
  var nets = os.networkInterfaces();
  var names = Object.keys(nets);
  for (var i = 0; i < names.length; i++) {
    var list = nets[names[i]] || [];
    for (var j = 0; j < list.length; j++) {
      var n = list[j];
      if (n && n.family === 'IPv4' && !n.internal) {
        return n.address;
      }
    }
  }
  return '127.0.0.1';
}

function sendCors(res, status, headers, body) {
  var out = headers || {};
  out['Access-Control-Allow-Origin'] = '*';
  out['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
  out['Access-Control-Allow-Headers'] = '*';
  out['Access-Control-Expose-Headers'] = '*';
  res.writeHead(status, out);
  if (body !== undefined && body !== null) {
    res.end(body);
  } else {
    res.end();
  }
}

function readTv4Session() {
  try {
    if (!fs.existsSync(TV4_SESSION_PATH)) return null;
    return JSON.parse(fs.readFileSync(TV4_SESSION_PATH, 'utf8'));
  } catch (_) {
    return null;
  }
}

function writeTv4Session(session) {
  fs.writeFileSync(TV4_SESSION_PATH, JSON.stringify(session, null, 2) + '\n');
}

function tv4HttpsJson(method, targetUrl, body, headers, cb) {
  var parsed = url.parse(targetUrl);
  var payload = body ? JSON.stringify(body) : null;
  var opts = {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port || 443,
    path: parsed.path,
    method: method,
    agent: httpsAgent,
    headers: Object.assign(
      {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Origin: 'https://www.tv4play.se',
        Referer: 'https://www.tv4play.se/'
      },
      headers || {}
    )
  };
  if (payload) {
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['Content-Length'] = Buffer.byteLength(payload);
  }
  var req = https.request(opts, function (resp) {
    var chunks = [];
    resp.on('data', function (c) {
      chunks.push(c);
    });
    resp.on('end', function () {
      var text = Buffer.concat(chunks).toString('utf8');
      var data = null;
      try {
        data = JSON.parse(text || '{}');
      } catch (_) {
        data = null;
      }
      cb(null, resp.statusCode || 0, data, text);
    });
  });
  req.on('error', function (err) {
    cb(err || new Error('TV4 network error'));
  });
  req.setTimeout(20000, function () {
    req.destroy(new Error('TV4 timeout'));
  });
  if (payload) req.write(payload);
  req.end();
}

function tv4JwtExp(accessToken) {
  try {
    var parts = String(accessToken || '').split('.');
    if (parts.length < 2) return 0;
    var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    return parseInt(payload.exp, 10) || 0;
  } catch (_) {
    return 0;
  }
}

// TV4 sometimes returns a huge/wrong expires_in; prefer JWT exp and cap TTL.
function tv4AccessExpiry(accessToken, expiresIn, now) {
  var jwtExp = tv4JwtExp(accessToken);
  if (jwtExp > now + 60) return jwtExp;
  var ttl = parseInt(expiresIn, 10) || 3600;
  if (ttl > 7200) ttl = 3600; // ignore absurd values (we've seen 10800000)
  return now + ttl;
}

function invalidateTv4AccessCache(session) {
  tv4AccessCache.token = null;
  tv4AccessCache.expiry = 0;
  if (session) {
    session.access_token = '';
    session.accessExpiry = 0;
    try {
      writeTv4Session(session);
    } catch (_) {}
  }
}

function getTv4AccessToken(cb, forceRefresh) {
  var now = Math.floor(Date.now() / 1000);
  if (!forceRefresh && tv4AccessCache.token && tv4AccessCache.expiry > now + 60) {
    cb(null, tv4AccessCache.token);
    return;
  }
  var session = readTv4Session();
  if (!session || !session.refresh_token) {
    cb(
      new Error(
        'TV4 session missing — run: node scripts/tv4-login.js'
      )
    );
    return;
  }
  if (!forceRefresh && session.access_token) {
    var storedExp = tv4AccessExpiry(session.access_token, session.expires_in, now);
    // Heal bogus accessExpiry written by older proxy builds
    if (session.accessExpiry !== storedExp) {
      session.accessExpiry = storedExp;
      try {
        writeTv4Session(session);
      } catch (_) {}
    }
    if (storedExp > now + 60) {
      tv4AccessCache.token = session.access_token;
      tv4AccessCache.expiry = storedExp;
      cb(null, session.access_token);
      return;
    }
  }
  tv4HttpsJson(
    'POST',
    TV4_AUTH_URL + '/token',
    {
      grant_type: 'refresh_token',
      refresh_token: session.refresh_token,
      profile_id: 'default',
      is_child: false
    },
    { 'client-name': TV4_CLIENT },
    function (err, status, data) {
      if (err) {
        cb(err);
        return;
      }
      if (status < 200 || status >= 300 || !data || !data.access_token) {
        cb(
          new Error(
            (data && (data.message || data.code)) ||
              'TV4 token HTTP ' + status + ' — run: node scripts/tv4-login.js'
          )
        );
        return;
      }
      var expiry = tv4AccessExpiry(data.access_token, data.expires_in, now);
      session.access_token = data.access_token;
      if (data.refresh_token) session.refresh_token = data.refresh_token;
      session.expires_in = Math.max(60, expiry - now);
      session.accessExpiry = expiry;
      session.updatedAt = new Date().toISOString();
      try {
        writeTv4Session(session);
      } catch (_) {}
      tv4AccessCache.token = data.access_token;
      tv4AccessCache.expiry = expiry;
      cb(null, data.access_token);
    }
  );
}

function handleTv4Play(req, res, parsed) {
  var assetId =
    (parsed.query && (parsed.query.id || parsed.query.assetId || parsed.query.asset)) || '';
  assetId = String(assetId || '').trim();
  if (!assetId) {
    sendCors(res, 400, { 'Content-Type': 'application/json' }, JSON.stringify({ ok: false, error: 'Missing id' }));
    return;
  }

  function playWithToken(accessToken, didRetry) {
    var playUrl =
      'https://playback2.a2d.tv/play/' +
      encodeURIComponent(assetId) +
      '?service=tv4&device=browser&protocol=hls&browser=chrome&capabilities=vod-hls';
    tv4HttpsJson(
      'GET',
      playUrl,
      null,
      { Authorization: 'Bearer ' + accessToken },
      function (err, status, data) {
        var streamUrl;
        var errMsg;
        var expired =
          status === 401 ||
          status === 403 ||
          (data &&
            (data.errorCode === 'LOGIN_REQUIRED' ||
              data.errorCode === 'token_expired' ||
              data.error === 'token_expired' ||
              /token_expired/i.test(String((data && (data.message || data.errorCode || data.error)) || ''))));
        if (err) {
          sendCors(
            res,
            502,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ ok: false, error: err.message || 'TV4 play failed' })
          );
          return;
        }
        if (expired && !didRetry) {
          invalidateTv4AccessCache(readTv4Session());
          getTv4AccessToken(function (authErr2, accessToken2) {
            if (authErr2 || !accessToken2) {
              sendCors(
                res,
                401,
                { 'Content-Type': 'application/json' },
                JSON.stringify({
                  ok: false,
                  error:
                    (authErr2 && authErr2.message) ||
                    'TV4 login required — run: node scripts/tv4-login.js'
                })
              );
              return;
            }
            playWithToken(accessToken2, true);
          }, true);
          return;
        }
        if (expired) {
          sendCors(
            res,
            401,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ ok: false, error: 'TV4 login required — run: node scripts/tv4-login.js' })
          );
          return;
        }
        if (status < 200 || status >= 300) {
          errMsg = (data && (data.message || data.errorCode)) || 'TV4 HTTP ' + status;
          sendCors(
            res,
            status || 502,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ ok: false, error: errMsg })
          );
          return;
        }
        streamUrl =
          data &&
          ((data.playbackItem && (data.playbackItem.manifestUrl || data.playbackItem.mediaUri)) ||
            data.manifestUrl ||
            data.mediaUri ||
            data.url);
        if (!streamUrl) {
          sendCors(
            res,
            502,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ ok: false, error: 'TV4 stream missing' })
          );
          return;
        }
        sendCors(
          res,
          200,
          { 'Content-Type': 'application/json; charset=utf-8' },
          JSON.stringify({ ok: true, url: streamUrl })
        );
      }
    );
  }

  getTv4AccessToken(function (authErr, accessToken) {
    if (authErr || !accessToken) {
      sendCors(
        res,
        401,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ ok: false, error: (authErr && authErr.message) || 'TV4 auth failed' })
      );
      return;
    }
    playWithToken(accessToken, false);
  });
}

function fetchUrl(targetUrl, redirectCount, cb) {
  if (redirectCount > 8) {
    cb(new Error('Too many redirects'));
    return;
  }
  var parsed = url.parse(targetUrl);
  var lib = parsed.protocol === 'http:' ? http : https;
  var host = (parsed.hostname || '').toLowerCase();
  var referer = 'https://www.kan.org.il/';
  var origin = 'https://www.kan.org.il';
  if (host.indexOf('mako') !== -1 || host.indexOf('keshet') !== -1 || /cloudfront\.net$/i.test(host)) {
    referer = 'https://www.mako.co.il/';
    origin = 'https://www.mako.co.il';
  }
  var req = lib.request(
    {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (SMART-TV; Linux; Tizen 9.0) AppleWebKit/537.36',
        Accept: '*/*',
        Referer: referer,
        Origin: origin
      },
      agent: parsed.protocol === 'http:' ? httpAgent : httpsAgent,
      timeout: 30000
    },
    function (resp) {
      var status = resp.statusCode || 0;
      if (status >= 300 && status < 400 && resp.headers.location) {
        var next = url.resolve(targetUrl, resp.headers.location);
        resp.resume();
        fetchUrl(next, redirectCount + 1, cb);
        return;
      }
      var chunks = [];
      resp.on('data', function (c) {
        chunks.push(c);
      });
      resp.on('end', function () {
        cb(null, {
          status: status,
          headers: resp.headers,
          body: Buffer.concat(chunks),
          finalUrl: targetUrl
        });
      });
    }
  );
  req.on('error', cb);
  req.on('timeout', function () {
    req.destroy();
    cb(new Error('Upstream timeout'));
  });
  req.end();
}

function isMakoMediaUrl(targetUrl) {
  return /mako-vod\.akamaized\.net/i.test(targetUrl) ||
    /mako-streaming\.akamaized\.net/i.test(targetUrl) ||
    (/cloudfront\.net/i.test(targetUrl) && /\/VOD\/KESHET\//i.test(targetUrl));
}

function withMakoTicket(targetUrl, cb) {
  if (!isMakoMediaUrl(targetUrl) || /[?&](hdnea|hdntl|token)=/i.test(targetUrl)) {
    cb(null, targetUrl);
    return;
  }
  var api =
    'https://mass.mako.co.il/ClicksStatistics/entitlementsServicesV2.jsp?et=gt&lp=' +
    encodeURIComponent(targetUrl) +
    '&rv=AKAMAI';
  fetchUrl(api, 0, function (err, result) {
    if (err || !result || result.status >= 400) {
      cb(err || new Error('Mako ticket HTTP ' + (result && result.status)));
      return;
    }
    try {
      var data = JSON.parse(result.body.toString('utf8'));
      var ticket = data && data.tickets && data.tickets[0] && data.tickets[0].ticket;
      if (!ticket) {
        cb(new Error('Mako ticket missing'));
        return;
      }
      cb(null, targetUrl + (targetUrl.indexOf('?') >= 0 ? '&' : '?') + ticket);
    } catch (e) {
      cb(e);
    }
  });
}

function isPlaylist(contentType, targetUrl, body) {
  var ct = (contentType || '').toLowerCase();
  if (ct.indexOf('mpegurl') !== -1 || ct.indexOf('m3u8') !== -1) {
    return true;
  }
  if (/\.m3u8(\?|$)/i.test(targetUrl)) {
    return true;
  }
  var head = body.slice(0, 12).toString('utf8');
  return head.indexOf('#EXTM3U') === 0;
}

function proxyPrefix(req) {
  var host = req.headers.host || '127.0.0.1:' + PORT;
  return 'http://' + host + '/proxy?url=';
}

function rewritePlaylist(text, playlistUrl, req) {
  var base = playlistUrl.replace(/[^\/?#]+(\?[^#]*)?(#.*)?$/, '');
  var prefix = proxyPrefix(req);
  return text
    .split(/\r?\n/)
    .map(function (line) {
      var trimmed = line.trim();
      if (!trimmed || trimmed.charAt(0) === '#') {
        return line.replace(/URI="([^"]+)"/gi, function (m, uri) {
          var abs = url.resolve(base, uri);
          return 'URI="' + prefix + encodeURIComponent(abs) + '"';
        });
      }
      var abs = url.resolve(base, trimmed);
      return prefix + encodeURIComponent(abs);
    })
    .join('\n');
}

var SEGMENT_CACHE_MAX = 16;
var SEGMENT_CACHE_BYTES = 80 * 1024 * 1024;
var PREFETCH_AHEAD = 4;
var PREFETCH_MAX = 2;
var segmentCache = [];
var segmentCacheBytes = 0;
var segmentWaiters = Object.create(null);
var segmentOrder = [];
var prefetchQueued = Object.create(null);
var prefetchActive = 0;

function getCachedSegment(targetUrl) {
  var i;
  for (i = 0; i < segmentCache.length; i++) {
    if (segmentCache[i].url === targetUrl) {
      return segmentCache[i];
    }
  }
  return null;
}

function rememberSegment(targetUrl, contentType, body) {
  var old;
  if (!targetUrl || !body || !body.length || getCachedSegment(targetUrl)) {
    return;
  }
  segmentCache.push({
    url: targetUrl,
    contentType: contentType || 'application/octet-stream',
    body: body
  });
  segmentCacheBytes += body.length;
  while (segmentCache.length > SEGMENT_CACHE_MAX || segmentCacheBytes > SEGMENT_CACHE_BYTES) {
    old = segmentCache.shift();
    if (old && old.body) {
      segmentCacheBytes -= old.body.length;
    }
  }
}

function listMediaSegments(text, playlistUrl) {
  var lines;
  var out;
  var i;
  var abs;
  if (/#EXT-X-STREAM-INF/i.test(text || '')) {
    return [];
  }
  lines = String(text || '').split(/\r?\n/);
  out = [];
  for (i = 0; i < lines.length; i++) {
    abs = absolutePlaylistUrl(playlistUrl, lines[i]);
    if (abs) {
      out.push(abs);
    }
  }
  return out;
}

function pumpPrefetch() {
  var urls;
  var i;
  var next;
  if (prefetchActive >= PREFETCH_MAX) {
    return;
  }
  urls = Object.keys(prefetchQueued);
  for (i = 0; i < urls.length && prefetchActive < PREFETCH_MAX; i++) {
    next = urls[i];
    delete prefetchQueued[next];
    if (getCachedSegment(next) || segmentWaiters[next]) {
      continue;
    }
    prefetchActive += 1;
    fetchShared(next, function () {
      prefetchActive -= 1;
      pumpPrefetch();
    });
  }
}

function schedulePrefetch(targetUrl) {
  if (!targetUrl) {
    return;
  }
  withMakoTicket(targetUrl, function (err, ticketed) {
    if (err || !ticketed) {
      return;
    }
    if (getCachedSegment(ticketed) || segmentWaiters[ticketed] || prefetchQueued[ticketed]) {
      return;
    }
    prefetchQueued[ticketed] = true;
    pumpPrefetch();
  });
}

function prefetchAheadOf(targetUrl) {
  var idx = segmentOrder.indexOf(targetUrl);
  var i;
  if (idx < 0) {
    return;
  }
  for (i = 1; i <= PREFETCH_AHEAD; i++) {
    if (segmentOrder[idx + i]) {
      schedulePrefetch(segmentOrder[idx + i]);
    }
  }
}

function fetchShared(targetUrl, cb) {
  var hit = getCachedSegment(targetUrl);
  var waiters;
  if (hit) {
    cb(null, {
      status: 200,
      headers: { 'content-type': hit.contentType, 'cache-control': 'public, max-age=60' },
      body: hit.body,
      finalUrl: targetUrl
    });
    return;
  }
  if (segmentWaiters[targetUrl]) {
    segmentWaiters[targetUrl].push(cb);
    return;
  }
  segmentWaiters[targetUrl] = [cb];
  fetchUrl(targetUrl, 0, function (err, result) {
    waiters = segmentWaiters[targetUrl] || [];
    delete segmentWaiters[targetUrl];
    if (
      !err &&
      result &&
      result.status < 400 &&
      result.body &&
      result.body.length &&
      !isPlaylist(result.headers['content-type'], result.finalUrl || targetUrl, result.body)
    ) {
      rememberSegment(targetUrl, result.headers['content-type'] || 'application/octet-stream', result.body);
    }
    waiters.forEach(function (fn) {
      try {
        fn(err, result);
      } catch (e) {}
    });
  });
}

function handleProxy(req, res, targetUrl) {
  withMakoTicket(targetUrl, function (ticketErr, ticketedUrl) {
    if (ticketErr) {
      sendCors(res, 502, { 'Content-Type': 'text/plain; charset=utf-8' }, String(ticketErr.message || ticketErr));
      return;
    }
    fetchShared(ticketedUrl, function (err, result) {
      if (err) {
        sendCors(res, 502, { 'Content-Type': 'text/plain; charset=utf-8' }, String(err.message || err));
        return;
      }
      if (result.status >= 400) {
        sendCors(
          res,
          result.status,
          { 'Content-Type': 'text/plain; charset=utf-8' },
          'Upstream HTTP ' + result.status
        );
        return;
      }

      var contentType = result.headers['content-type'] || 'application/octet-stream';
      if (isPlaylist(contentType, result.finalUrl || ticketedUrl, result.body)) {
        var text = result.body.toString('utf8');
        var segs = listMediaSegments(text, result.finalUrl || ticketedUrl);
        var rewritten = rewritePlaylist(text, result.finalUrl || ticketedUrl, req);
        if (segs.length) {
          segmentOrder = segs;
          segs.slice(0, PREFETCH_AHEAD).forEach(schedulePrefetch);
        }
        sendCors(
          res,
          200,
          {
            'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
            'Cache-Control': 'no-cache'
          },
          rewritten
        );
        return;
      }

      sendCors(
        res,
        200,
        {
          'Content-Type': contentType,
          'Cache-Control': result.headers['cache-control'] || 'public, max-age=60'
        },
        result.body
      );
      prefetchAheadOf(targetUrl);
      if (ticketedUrl !== targetUrl) {
        prefetchAheadOf(ticketedUrl);
      }
    });
  });
}

function runNextFrameJob() {
  if (activeFrames >= MAX_PARALLEL_FRAMES || !frameWaiters.length) {
    return;
  }
  var job = frameWaiters.shift();
  activeFrames += 1;
  captureFrame(job.targetUrl, function (err, jpeg) {
    activeFrames -= 1;
    try {
      job.cb(err, jpeg);
    } finally {
      runNextFrameJob();
    }
  });
}

function enqueueFrame(targetUrl, cb) {
  frameWaiters.push({ targetUrl: targetUrl, cb: cb });
  runNextFrameJob();
}

function absolutePlaylistUrl(baseUrl, ref) {
  if (!ref) {
    return '';
  }
  ref = String(ref).trim();
  if (!ref || ref.charAt(0) === '#') {
    return '';
  }
  try {
    return url.resolve(baseUrl, ref);
  } catch (e) {
    return '';
  }
}

function pickLowestVariant(masterText, masterUrl) {
  var lines = String(masterText || '').split(/\r?\n/);
  var bestUrl = '';
  var bestBw = Infinity;
  var i;
  var bwMatch;
  var bw;
  var next;
  for (i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('#EXT-X-STREAM-INF') !== 0) {
      continue;
    }
    bwMatch = /BANDWIDTH=(\d+)/i.exec(lines[i]);
    bw = bwMatch ? parseInt(bwMatch[1], 10) : 999999999;
    next = absolutePlaylistUrl(masterUrl, lines[i + 1]);
    if (next && bw < bestBw) {
      bestBw = bw;
      bestUrl = next;
    }
  }
  return bestUrl;
}

function pickLatestSegment(mediaText, mediaUrl) {
  var lines = String(mediaText || '').split(/\r?\n/);
  var last = '';
  var i;
  var abs;
  for (i = 0; i < lines.length; i++) {
    abs = absolutePlaylistUrl(mediaUrl, lines[i]);
    if (abs) {
      last = abs;
    }
  }
  return last;
}

function isTsLikeSegment(segUrl) {
  return /\.ts(\?|$)/i.test(segUrl || '') || /mpegts|video\/mp2t/i.test(segUrl || '');
}

function fetchText(targetUrl, cb) {
  fetchUrl(targetUrl, 0, function (err, result) {
    if (err || !result) {
      cb(err || new Error('fetch failed'));
      return;
    }
    if (result.status >= 400) {
      cb(new Error('HTTP ' + result.status));
      return;
    }
    cb(null, result.body.toString('utf8'), result.finalUrl || targetUrl);
  });
}

/** Prefer a single low-bitrate .ts segment — much faster than opening live HLS in ffmpeg. */
function resolveThumbSegment(streamUrl, cb) {
  fetchText(streamUrl, function (err, text, finalUrl) {
    if (err || !text) {
      cb(err || new Error('playlist empty'));
      return;
    }
    var base = finalUrl || streamUrl;
    var mediaUrl = base;
    var mediaText = text;
    if (/#EXT-X-STREAM-INF/i.test(text)) {
      mediaUrl = pickLowestVariant(text, base);
      if (!mediaUrl) {
        cb(new Error('no variant'));
        return;
      }
      fetchText(mediaUrl, function (err2, text2, final2) {
        if (err2 || !text2) {
          cb(err2 || new Error('media playlist empty'));
          return;
        }
        var seg = pickLatestSegment(text2, final2 || mediaUrl);
        if (!seg) {
          cb(new Error('no segment'));
          return;
        }
        cb(null, seg);
      });
      return;
    }
    var segDirect = pickLatestSegment(mediaText, mediaUrl);
    if (!segDirect) {
      cb(new Error('no segment'));
      return;
    }
    cb(null, segDirect);
  });
}

function runFfmpegJpeg(inputPathOrUrl, outFile, isLocalFile, cb) {
  var args = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y'
  ];
  if (!isLocalFile) {
    args.push(
      '-fflags',
      'nobuffer+discardcorrupt',
      '-flags',
      'low_delay',
      '-analyzeduration',
      '400000',
      '-probesize',
      '400000',
      '-rw_timeout',
      '4000000',
      '-user_agent',
      'Mozilla/5.0 (SMART-TV; Linux; Tizen 9.0) AppleWebKit/537.36'
    );
  }
  args.push(
    '-i',
    inputPathOrUrl,
    '-an',
    '-frames:v',
    '1',
    '-vf',
    'scale=320:-2',
    '-q:v',
    '8',
    outFile
  );

  var child = childProcess.spawn(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  var stderr = '';
  var settled = false;
  var timer = setTimeout(function () {
    if (settled) {
      return;
    }
    settled = true;
    try {
      child.kill('SIGKILL');
    } catch (e) {}
    cleanupFile(outFile);
    cb(new Error('ffmpeg timeout'));
  }, isLocalFile ? 4000 : FRAME_TIMEOUT_MS);

  child.stderr.on('data', function (buf) {
    stderr += buf.toString();
  });
  child.on('error', function (err) {
    if (settled) {
      return;
    }
    settled = true;
    clearTimeout(timer);
    cleanupFile(outFile);
    cb(err);
  });
  child.on('close', function (code) {
    if (settled) {
      return;
    }
    settled = true;
    clearTimeout(timer);
    if (code !== 0) {
      cleanupFile(outFile);
      cb(new Error(stderr.trim() || 'ffmpeg exit ' + code));
      return;
    }
    fs.readFile(outFile, function (readErr, data) {
      cleanupFile(outFile);
      if (readErr || !data || !data.length) {
        cb(readErr || new Error('empty frame'));
        return;
      }
      cb(null, data);
    });
  });
}

function captureFromSegment(segUrl, outFile, cb) {
  var segFile = outFile + '.seg';
  fetchUrl(segUrl, 0, function (err, result) {
    if (err || !result || result.status >= 400 || !result.body || !result.body.length) {
      cleanupFile(segFile);
      cb(err || new Error('segment HTTP ' + (result && result.status)));
      return;
    }
    // Cap huge segments — first ~2.5MB is enough for a keyframe in typical live TS
    var body = result.body.length > 2500000 ? result.body.slice(0, 2500000) : result.body;
    fs.writeFile(segFile, body, function (writeErr) {
      if (writeErr) {
        cleanupFile(segFile);
        cb(writeErr);
        return;
      }
      runFfmpegJpeg(segFile, outFile, true, function (ffErr, jpeg) {
        cleanupFile(segFile);
        cb(ffErr, jpeg);
      });
    });
  });
}

function captureFrame(targetUrl, cb) {
  var cached = getCachedFrame(targetUrl);
  if (cached) {
    cb(null, cached);
    return;
  }

  var outFile = path.join(
    FRAME_DIR,
    'frame-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg'
  );

  function finish(err, jpeg) {
    if (err || !jpeg) {
      cb(err || new Error('empty frame'));
      return;
    }
    setCachedFrame(targetUrl, jpeg);
    cb(null, jpeg);
  }

  resolveThumbSegment(targetUrl, function (segErr, segUrl) {
    if (!segErr && segUrl && isTsLikeSegment(segUrl)) {
      captureFromSegment(segUrl, outFile, function (err, jpeg) {
        if (!err && jpeg) {
          finish(null, jpeg);
          return;
        }
        console.warn('[frame] segment path failed, falling back to stream:', (err && err.message) || segErr);
        var fallbackOut = path.join(
          FRAME_DIR,
          'frame-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg'
        );
        runFfmpegJpeg(targetUrl, fallbackOut, false, finish);
      });
      return;
    }
    // CMAF / odd packs — open the stream (or media playlist) directly
    runFfmpegJpeg(targetUrl, outFile, false, finish);
  });
}

function cleanupFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (e) {}
}

function handleFrame(req, res, targetUrl) {
  withMakoTicket(targetUrl, function (ticketErr, ticketedUrl) {
    if (ticketErr) {
      console.warn('[frame] mako ticket failed:', targetUrl, ticketErr.message || ticketErr);
      sendCors(res, 502, { 'Content-Type': 'text/plain; charset=utf-8' }, String(ticketErr.message || ticketErr));
      return;
    }
    var warm = getCachedFrame(ticketedUrl) || getCachedFrame(targetUrl);
    if (warm) {
      sendCors(
        res,
        200,
        {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=30'
        },
        warm
      );
      return;
    }
    enqueueFrame(ticketedUrl, function (err, jpeg) {
      if (err) {
        console.warn('[frame] failed:', ticketedUrl, err.message || err);
        sendCors(res, 502, { 'Content-Type': 'text/plain; charset=utf-8' }, String(err.message || err));
        return;
      }
      console.log('[frame] ok:', targetUrl, jpeg.length + ' bytes');
      sendCors(
        res,
        200,
        {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=30'
        },
        jpeg
      );
    });
  });
}

function catalogContentType(filePath) {
  var ext = path.extname(filePath).toLowerCase();
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

function sendCatalogFile(res, absPath) {
  if (!absPath || absPath.indexOf(CATALOG_DIR) !== 0) {
    sendCors(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');
    return;
  }
  fs.readFile(absPath, function (err, data) {
    if (err) {
      sendCors(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
      return;
    }
    sendCors(
      res,
      200,
      {
        'Content-Type': catalogContentType(absPath),
        'Cache-Control': 'no-cache'
      },
      data
    );
  });
}

/** Serve a real http(s) page that embeds YouTube so the player gets a Referer (Error 153). */
function handleYoutubeEmbed(req, res, parsed) {
  var videoId = parsed && parsed.query && parsed.query.v;
  if (!videoId || typeof videoId !== 'string' || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
    sendCors(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Missing or invalid v');
    return;
  }
  var host = (req.headers && req.headers.host) || '127.0.0.1:' + PORT;
  var origin = 'http://' + host;
  var embed =
    'https://www.youtube.com/embed/' +
    videoId +
    '?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=' +
    encodeURIComponent(origin);
  var html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="referrer" content="strict-origin-when-cross-origin">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>ISRTV YouTube</title>' +
    '<style>html,body{margin:0;background:#000;width:100%;height:100%;overflow:hidden}' +
    'iframe{border:0;position:absolute;inset:0;width:100%;height:100%}</style></head><body>' +
    '<iframe src="' +
    embed +
    '" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
    '</body></html>';
  sendCors(
    res,
    200,
    {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    html
  );
}

function handleCatalog(req, res, pathname) {
  var rel = pathname.replace(/^\/catalog\/?/, '');
  if (!rel || rel === '') {
    sendCatalogFile(res, path.join(CATALOG_DIR, 'manifest.json'));
    return;
  }
  if (rel === 'manifest' || rel === 'manifest.json') {
    sendCatalogFile(res, path.join(CATALOG_DIR, 'manifest.json'));
    return;
  }
  var mPkg = rel.match(/^packages\/([A-Za-z0-9_-]+)(?:\.json)?$/);
  if (mPkg) {
    sendCatalogFile(res, path.join(CATALOG_DIR, 'packages', mPkg[1] + '.json'));
    return;
  }
  var mMedia = rel.match(/^media\/([A-Za-z0-9_-]+)\/([A-Za-z0-9._-]+)$/);
  if (mMedia) {
    sendCatalogFile(res, path.join(CATALOG_DIR, 'media', mMedia[1], mMedia[2]));
    return;
  }
  // Compare helper: /catalog/check?known=slug:version,slug:version
  if (rel === 'check') {
    var parsed = url.parse(req.url, true);
    var knownRaw = (parsed.query && parsed.query.known) || '';
    var known = Object.create(null);
    String(knownRaw)
      .split(',')
      .forEach(function (part) {
        var bits = part.split(':');
        if (bits[0]) known[bits[0]] = bits[1] || '';
      });
    var manifestPath = path.join(CATALOG_DIR, 'manifest.json');
    fs.readFile(manifestPath, 'utf8', function (err, text) {
      if (err) {
        sendCors(
          res,
          200,
          { 'Content-Type': 'application/json; charset=utf-8' },
          JSON.stringify({ ok: true, updates: [], message: 'no catalog yet' })
        );
        return;
      }
      var manifest;
      try {
        manifest = JSON.parse(text);
      } catch (e) {
        sendCors(res, 500, { 'Content-Type': 'text/plain' }, 'Bad manifest');
        return;
      }
      var updates = [];
      (manifest.series || []).forEach(function (s) {
        var localVer = known[s.slug];
        if (localVer === undefined || localVer !== s.version) {
          updates.push({
            slug: s.slug,
            title: s.title,
            source: s.source,
            version: s.version,
            episodeCount: s.episodeCount,
            updatedAt: s.updatedAt,
            packageURL: '/catalog/packages/' + s.slug + '.json'
          });
        }
      });
      sendCors(
        res,
        200,
        { 'Content-Type': 'application/json; charset=utf-8' },
        JSON.stringify({ ok: true, updates: updates, updatedAt: manifest.updatedAt })
      );
    });
    return;
  }
  sendCors(res, 404, { 'Content-Type': 'text/plain' }, 'Catalog path not found');
}

var server = http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    sendCors(res, 204);
    return;
  }

  var parsed = url.parse(req.url, true);
  if (parsed.pathname === '/health' || parsed.pathname === '/') {
    sendCors(
      res,
      200,
      { 'Content-Type': 'application/json; charset=utf-8' },
      JSON.stringify({
        ok: true,
        service: 'isrtv-vod-proxy',
        framesQueued: frameWaiters.length,
        framesActive: activeFrames,
        catalog: fs.existsSync(path.join(CATALOG_DIR, 'manifest.json'))
      })
    );
    return;
  }

  if (parsed.pathname === '/proxy') {
    var target = parsed.query && parsed.query.url;
    if (!target || typeof target !== 'string') {
      sendCors(res, 400, { 'Content-Type': 'text/plain' }, 'Missing url');
      return;
    }
    if (!/^https?:\/\//i.test(target)) {
      sendCors(res, 400, { 'Content-Type': 'text/plain' }, 'Only http(s) urls allowed');
      return;
    }
    handleProxy(req, res, target);
    return;
  }

  if (parsed.pathname === '/frame') {
    var frameTarget = parsed.query && parsed.query.url;
    if (!frameTarget || typeof frameTarget !== 'string') {
      sendCors(res, 400, { 'Content-Type': 'text/plain' }, 'Missing url');
      return;
    }
    if (!/^https?:\/\//i.test(frameTarget)) {
      sendCors(res, 400, { 'Content-Type': 'text/plain' }, 'Only http(s) urls allowed');
      return;
    }
    handleFrame(req, res, frameTarget);
    return;
  }

  if (parsed.pathname === '/catalog' || (parsed.pathname && parsed.pathname.indexOf('/catalog/') === 0)) {
    handleCatalog(req, res, parsed.pathname);
    return;
  }

  if (parsed.pathname === '/youtube') {
    handleYoutubeEmbed(req, res, parsed);
    return;
  }

  if (parsed.pathname === '/tv4/play') {
    handleTv4Play(req, res, parsed);
    return;
  }

  sendCors(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
});

server.keepAliveTimeout = 10000;
server.headersTimeout = 20000;
server.listen(PORT, HOST, function () {
  var ip = lanIPv4();
  console.log('ISRTV media proxy listening on http://' + ip + ':' + PORT);
  console.log('  health:  http://' + ip + ':' + PORT + '/health');
  console.log('  frame:   http://' + ip + ':' + PORT + '/frame?url=<stream>');
  console.log('  proxy:   http://' + ip + ':' + PORT + '/proxy?url=<media>');
  console.log('  catalog: http://' + ip + ':' + PORT + '/catalog/manifest');
  console.log('  check:   http://' + ip + ':' + PORT + '/catalog/check?known=slug:version');
  console.log('  youtube: http://' + ip + ':' + PORT + '/youtube?v=<videoId>');
  console.log('  tv4:     http://' + ip + ':' + PORT + '/tv4/play?id=<assetId>');
  console.log('Keep this running for live thumbnails + KanBox VOD + catalog updates.');
});
