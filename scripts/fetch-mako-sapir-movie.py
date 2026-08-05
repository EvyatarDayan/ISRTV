#!/usr/bin/env python3
"""Fetch Mako ספיר movie."""
from __future__ import annotations

import json
import os
import re
import ssl
import time
import urllib.request

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DELAY = 0.9
SLUG = "sapir-movie"
FAMILY = "sapir_movie"
OUT_JSON = os.path.join(ROOT, "scripts", f"mako-{SLUG}.json")
BASE = f"https://www.mako.co.il/mako-vod-keshet/{FAMILY}"


def fetch(url: str, retries: int = 5) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8",
                    "Accept": "text/html,application/xhtml+xml,application/json,*/*",
                    "Referer": "https://www.mako.co.il/mako-vod-keshet/wedding-at-first-sight-s8",
                },
            )
            with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
                body = r.read()
            text = body[:800].decode("utf-8", "ignore").lower()
            if "radware" in text or "shieldsquare" in text:
                raise RuntimeError("Radware block")
            return body
        except Exception as e:
            last = e
            wait = DELAY * (2 + i * 2)
            print(f"  retry {i+1}/{retries} after {wait:.1f}s: {e}")
            time.sleep(wait)
    raise last  # type: ignore


def parse_next(html: str):
    m = re.search(r"<script[^>]*__NEXT_DATA__[^>]*>(.*?)</script>", html, re.S)
    return json.loads(m.group(1)) if m else None


def to_akamai(u: str | None) -> str | None:
    if not u:
        return u
    if "mako-vod.akamaized.net" in u and u.endswith(".m3u8"):
        return u
    u = re.sub(r"https://[^/]+/hls/", "https://mako-vod.akamaized.net/i/", u)
    if u.endswith(",550,850,1400,2200,") or u.endswith(",550,850,1400,2200,.mp4.csmil"):
        if not u.endswith("/master.m3u8"):
            if not u.endswith(".mp4.csmil"):
                u = u + ".mp4.csmil/master.m3u8"
            else:
                u = u + "/master.m3u8"
    u = u.replace("/index.m3u8", "/master.m3u8")
    return u


def save_image(url: str | None, dest_rel: str) -> str | None:
    if not url:
        return None
    dest = os.path.join(ROOT, dest_rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        open(dest, "wb").write(fetch(url))
        time.sleep(DELAY * 0.25)
        return dest_rel
    except Exception as e:
        print(f"    img fail: {e}")
        return None


def main():
    print("==== sapir-movie")
    html = fetch(BASE).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    if not data:
        raise SystemExit("no __NEXT_DATA__ on series page")
    page = data["props"]["pageProps"]["data"]
    series_title = ((page.get("seo") or {}).get("schema") or {}).get("name") or "ספיר"
    vod = page.get("vod") or {}
    hist = page.get("historyObject") or {}
    vod_path = vod.get("pageUrl") or hist.get("pageUrl")
    if not vod_path:
        raise SystemExit("no movie VOD url")
    vod_url = "https://www.mako.co.il" + vod_path if vod_path.startswith("/") else vod_path
    print("  title", series_title)
    print("  vod", vod_url)

    vhtml = fetch(vod_url).decode("utf-8", "ignore")
    time.sleep(DELAY)
    vdata = parse_next(vhtml)
    if not vdata:
        raise SystemExit("no __NEXT_DATA__ on vod page")
    vpage = vdata["props"]["pageProps"]["data"]
    seo = vpage.get("seo") or {}
    schema = seo.get("schema") or {}
    video = schema.get("video") or {}
    hero = vpage.get("hero") or {}
    ep_title = (video.get("name") or schema.get("name") or hist.get("title") or series_title).strip()
    subtitle = (hero.get("description") or schema.get("description") or "").strip()
    if subtitle == ep_title:
        subtitle = ""
    stream = to_akamai(video.get("contentUrl"))
    image = schema.get("image") or video.get("thumbnailUrl")
    poster_src = None
    hero_pics = ((page.get("hero") or {}).get("pics") or [])
    if hero_pics:
        poster_src = hero_pics[0].get("picUrl")
    poster_src = poster_src or ((hist.get("hero") or {}).get("picUrl")) or image

    local_ep = f"images/kanbox/{SLUG}/ep1.jpg"
    local_poster = f"images/kanbox/{SLUG}/series.jpg"
    save_image(image or poster_src, local_ep)
    save_image(poster_src or image, local_poster)

    out = {
        "slug": SLUG,
        "title": series_title,
        "source": "mako",
        "pageURL": BASE,
        "localPoster": local_poster,
        "episodes": [
            {
                "ep": 1,
                "season": 1,
                "name": ep_title,
                "subtitle": subtitle,
                "pageURL": vod_url,
                "streamURL": stream,
                "imageRemote": image,
                "streamOk": bool(stream),
                "localImage": local_ep,
            }
        ],
    }
    json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"DONE stream={'yes' if stream else 'NO'} title={series_title} ep={ep_title}")
    print(" stream", stream)


if __name__ == "__main__":
    main()
