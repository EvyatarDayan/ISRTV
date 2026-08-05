#!/usr/bin/env python3
"""Fetch Mako חתונה ממבט ראשון season 7 and merge into existing series JSON."""
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
SLUG = "wedding-at-first-sight"
SEASON = 7
SEASON_PATH = "wedding-at-first-sight-s7"
SEASON_URL = f"https://www.mako.co.il/mako-vod-keshet/{SEASON_PATH}"
OUT_JSON = os.path.join(ROOT, "scripts", f"mako-{SLUG}.json")


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
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
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


def scrape_episode(page_url: str, ep_hint: int, title_hint: str, img_hint: str | None) -> dict:
    html = fetch(page_url).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    title = title_hint or f"פרק {ep_hint}"
    subtitle = ""
    stream = None
    image = img_hint
    ep = ep_hint
    if data:
        page = data["props"]["pageProps"]["data"]
        seo = page.get("seo") or {}
        schema = seo.get("schema") or {}
        video = schema.get("video") or {}
        hero = page.get("hero") or {}
        title = (schema.get("name") or hero.get("subtitle") or title).strip() or title
        subtitle = (
            (schema.get("description") or hero.get("description") or "").strip()
        )
        if subtitle == title:
            subtitle = (hero.get("description") or "").strip()
            if subtitle == title:
                subtitle = ""
        stream = to_akamai(video.get("contentUrl"))
        image = schema.get("image") or video.get("thumbnailUrl") or image
        try:
            if schema.get("episodeNumber"):
                ep = int(schema["episodeNumber"])
        except Exception:
            pass
        extra = str(hero.get("extraInfo") or "")
        m = re.search(r"פרק\s+(\d+)", extra)
        if m:
            ep = int(m.group(1))
    return {
        "ep": ep,
        "season": SEASON,
        "name": title,
        "subtitle": subtitle,
        "pageURL": page_url,
        "streamURL": stream,
        "imageRemote": image,
        "streamOk": bool(stream),
    }


def ep_key(e: dict) -> tuple:
    return (int(e.get("season") or 0), int(e.get("ep") or 0), e.get("pageURL") or "")


def main():
    print("==== wedding-at-first-sight s7")
    html = fetch(SEASON_URL).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    if not data:
        raise SystemExit("no __NEXT_DATA__ on season page")
    page = data["props"]["pageProps"]["data"]
    vods = ((page.get("menu") or [{}])[0].get("vods") or [])
    items = []
    for v in vods:
        title = (v.get("title") or "").strip()
        page_url = v.get("pageUrl") or ""
        extra = v.get("extraInfo") or ""
        if not title or not page_url:
            continue
        m = re.search(r"פרק\s+(\d+)", str(extra))
        ep = int(m.group(1)) if m else None
        pics = v.get("pics") or []
        img = pics[0].get("picUrl") if pics else None
        items.append(
            {
                "ep": ep,
                "title": title,
                "pageUrl": "https://www.mako.co.il" + page_url
                if page_url.startswith("/")
                else page_url,
                "image": img,
            }
        )
    items.sort(key=lambda x: x["ep"] or 999)
    print(f"  listed {len(items)} episodes")

    existing = []
    if os.path.exists(OUT_JSON):
        prev = json.load(open(OUT_JSON, encoding="utf-8"))
        existing = list(prev.get("episodes") or [])
        print(f"  keep existing {len(existing)}")

    done = {}
    for e in existing:
        if e.get("streamURL") and e.get("pageURL"):
            done[e["pageURL"]] = e

    season_eps = []
    for i, item in enumerate(items):
        page_url = item["pageUrl"]
        ep_hint = item["ep"] or (i + 1)
        if page_url in done:
            print(f"  - ep{ep_hint} CACHED {item['title']}")
            season_eps.append(done[page_url])
            continue
        print(f"  - ep{ep_hint} {item['title']}")
        ep = scrape_episode(page_url, ep_hint, item["title"], item["image"])
        img_rel = f"images/kanbox/{SLUG}/s{SEASON}-ep{ep['ep']}.jpg"
        ep["localImage"] = save_image(ep.get("imageRemote") or item["image"], img_rel)
        season_eps.append(ep)

        merged_partial = existing + [e for e in season_eps if e.get("pageURL") not in {x.get("pageURL") for x in existing}]
        json.dump(
            {
                "slug": SLUG,
                "title": "חתונה ממבט ראשון",
                "source": "mako",
                "pageURL": "https://www.mako.co.il/mako-vod-keshet/wedding-at-first-sight-s8",
                "localPoster": f"images/kanbox/{SLUG}/series.jpg",
                "episodes": sorted(merged_partial, key=ep_key),
            },
            open(OUT_JSON, "w", encoding="utf-8"),
            ensure_ascii=False,
            indent=2,
        )

    by_page = {e.get("pageURL"): e for e in existing if e.get("pageURL")}
    for e in season_eps:
        by_page[e.get("pageURL")] = e
    episodes = sorted(by_page.values(), key=ep_key)

    out = {
        "slug": SLUG,
        "title": "חתונה ממבט ראשון",
        "source": "mako",
        "pageURL": "https://www.mako.co.il/mako-vod-keshet/wedding-at-first-sight-s8",
        "localPoster": f"images/kanbox/{SLUG}/series.jpg",
        "episodes": episodes,
    }
    json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    s7 = [e for e in episodes if e.get("season") == 7]
    ok = sum(1 for e in s7 if e.get("streamURL"))
    print(f"DONE s7 {ok}/{len(s7)} streams; total episodes {len(episodes)}")


if __name__ == "__main__":
    main()
