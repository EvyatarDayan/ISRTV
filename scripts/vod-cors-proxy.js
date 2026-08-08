#!/usr/bin/env node
/**
 * Media helper proxy for Samsung Tizen ISRTV:
 *  - /proxy  — CORS proxy for HLS/DASH (Kan VOD)
 *  - /frame  — JPEG still from a live/VOD stream via ffmpeg (live thumbnails)
 *
 * Usage: node scripts/vod-cors-proxy.js
 * Default: http://0.0.0.0:8791
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
var FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
var FRAME_DIR = path.join(os.tmpdir(), 'isrtv-frames');
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
      timeout: 20000
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

function handleProxy(req, res, targetUrl) {
  withMakoTicket(targetUrl, function (ticketErr, ticketedUrl) {
    if (ticketErr) {
      sendCors(res, 502, { 'Content-Type': 'text/plain; charset=utf-8' }, String(ticketErr.message || ticketErr));
      return;
    }
    fetchUrl(ticketedUrl, 0, function (err, result) {
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
        var rewritten = rewritePlaylist(text, result.finalUrl || ticketedUrl, req);
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
        framesActive: activeFrames
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

  sendCors(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
});

server.listen(PORT, HOST, function () {
  var ip = lanIPv4();
  console.log('ISRTV media proxy listening on http://' + ip + ':' + PORT);
  console.log('  health: http://' + ip + ':' + PORT + '/health');
  console.log('  frame:  http://' + ip + ':' + PORT + '/frame?url=<stream>');
  console.log('  proxy:  http://' + ip + ':' + PORT + '/proxy?url=<media>');
  console.log('Keep this running for live thumbnails + KanBox VOD on the TV.');
});
