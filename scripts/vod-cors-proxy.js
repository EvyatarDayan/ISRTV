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
var MAX_PARALLEL_FRAMES = 3;
var frameWaiters = [];

try {
  fs.mkdirSync(FRAME_DIR, { recursive: true });
} catch (e) {}

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

function captureFrame(targetUrl, cb) {
  var outFile = path.join(
    FRAME_DIR,
    'frame-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg'
  );

  var args = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-analyzeduration',
    '1500000',
    '-probesize',
    '1500000',
    '-rw_timeout',
    '8000000',
    '-i',
    targetUrl,
    '-an',
    '-frames:v',
    '1',
    '-q:v',
    '5',
    outFile
  ];

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
  }, 20000);

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
          'Cache-Control': 'no-cache, no-store'
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
