#!/usr/bin/env python3
"""Fetch Mako הנערים (the_boys)."""
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
SLUG = "the-boys"
FAMILY = "the_boys"
OUT_JSON = os.path.join(ROOT, "scripts", f"mako-{SLUG}.json")
FALLBACK_TITLE = "הנערים"
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
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
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


def scrape_episode(page_url: str, season: int, ep_hint: int, title_hint: str, img_hint: str | None) -> dict:
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
        subtitle = (schema.get("description") or hero.get("description") or "").strip()
        if subtitle == title:
            subtitle = (hero.get("description") or "").strip()
            if subtitle == title:
                subtitle = ""
        stream = to_akamai(video.get("contentUrl"))
        image = schema.get("image") or video.get("thumbnailUrl") or image
    return {
        "ep": ep,
        "season": season,
        "name": title,
        "subtitle": subtitle,
        "pageURL": page_url,
        "streamURL": stream,
        "imageRemote": image,
        "streamOk": bool(stream),
    }


def discover_seasons(page: dict) -> list[tuple[int, str]]:
    out = []
    for s in page.get("seasons") or []:
        path = (s.get("pageUrl") or "").rstrip("/").split("/")[-1]
        title = s.get("seasonTitle") or ""
        m = re.search(r"(\d+)", title) or re.search(r"-s(\d+)$", path, re.I)
        if not path or not m:
            continue
        out.append((int(m.group(1)), path))
    if not out:
        out = [(1, f"{FAMILY}-s1")]
    return sorted(set(out))


def list_season_items(season_path: str, season: int) -> tuple[list[dict], dict | None]:
    url = f"https://www.mako.co.il/mako-vod-keshet/{season_path}"
    print(f"  season page {url}")
    html = fetch(url).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    if not data:
        raise RuntimeError(f"no __NEXT_DATA__ on {season_path}")
    page = data["props"]["pageProps"]["data"]
    vods = ((page.get("menu") or [{}])[0].get("vods") or [])
    items = []
    for v in vods:
        title = (v.get("title") or "").strip()
        page_url = v.get("pageUrl") or ""
        extra = v.get("extraInfo") or ""
        if not title or not page_url:
            continue
        m = re.search(r"פרק\s+(\d+)", str(extra or ""))
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
    numbered = [x for x in items if x["ep"] is not None]
    unnumbered = [x for x in items if x["ep"] is None]
    numbered.sort(key=lambda x: x["ep"])
    next_ep = 1
    for x in unnumbered:
        while any(y["ep"] == next_ep for y in numbered):
            next_ep += 1
        x["ep"] = next_ep
        next_ep += 1
    items = sorted(unnumbered + numbered, key=lambda x: x["ep"] or 999)
    return items, page


def ep_key(e: dict) -> tuple:
    return (int(e.get("season") or 0), int(e.get("ep") or 0), e.get("pageURL") or "")


def dump(title: str, episodes: list[dict]) -> None:
    json.dump(
        {
            "slug": SLUG,
            "title": title,
            "source": "mako",
            "pageURL": BASE,
            "localPoster": f"images/kanbox/{SLUG}/series.jpg",
            "episodes": sorted(episodes, key=ep_key),
        },
        open(OUT_JSON, "w", encoding="utf-8"),
        ensure_ascii=False,
        indent=2,
    )


def main():
    print(f"==== {SLUG}")
    html = fetch(BASE).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    if not data:
        raise SystemExit("no __NEXT_DATA__")
    page = data["props"]["pageProps"]["data"]
    title = (
        ((page.get("seo") or {}).get("schema") or {}).get("name")
        or FALLBACK_TITLE
    )
    seasons = discover_seasons(page)
    print(f"  title={title} seasons={seasons}")

    done = {}
    if os.path.exists(OUT_JSON):
        prev = json.load(open(OUT_JSON, encoding="utf-8"))
        for e in prev.get("episodes") or []:
            if e.get("streamURL") and e.get("pageURL"):
                done[e["pageURL"]] = e
        print(f"  resume {len(done)}")

    episodes = []
    poster_src = None
    hero_pics = ((page.get("hero") or {}).get("pics") or [])
    if hero_pics:
        poster_src = hero_pics[0].get("picUrl")

    for season, season_path in seasons:
        items, spage = list_season_items(season_path, season)
        print(f"  listed s{season}: {len(items)} episodes")
        if spage and not poster_src:
            hp = ((spage.get("hero") or {}).get("pics") or [])
            if hp:
                poster_src = hp[0].get("picUrl")
        for i, item in enumerate(items):
            page_url = item["pageUrl"]
            ep_hint = item["ep"] or (i + 1)
            if page_url in done:
                print(f"  - s{season} ep{ep_hint} CACHED {item['title']}")
                episodes.append(done[page_url])
                continue
            print(f"  - s{season} ep{ep_hint} {item['title']}")
            ep = scrape_episode(page_url, season, ep_hint, item["title"], item["image"])
            img_rel = f"images/kanbox/{SLUG}/s{season}-ep{ep['ep']}.jpg"
            ep["localImage"] = save_image(ep.get("imageRemote") or item["image"], img_rel)
            episodes.append(ep)
            dump(title, episodes)

    poster = f"images/kanbox/{SLUG}/series.jpg"
    if poster_src:
        save_image(poster_src, poster)
    elif episodes:
        first = next((e.get("localImage") for e in episodes if e.get("localImage")), None)
        if first:
            open(os.path.join(ROOT, poster), "wb").write(
                open(os.path.join(ROOT, first), "rb").read()
            )

    dump(title, episodes)
    ok = sum(1 for e in episodes if e.get("streamURL"))
    print(f"DONE {ok}/{len(episodes)} streams title={title}")


if __name__ == "__main__":
    main()
