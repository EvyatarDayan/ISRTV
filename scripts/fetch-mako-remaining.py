#!/usr/bin/env python3
"""Scrape remaining/incomplete Mako series with known season-path overrides."""
from __future__ import annotations

import json
import os
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DELAY = 1.35

# Explicit season pages (site casing / odd -s-1 paths)
JOBS = [
    {
        "slug": "arabic-work",
        "title": "עבודה ערבית",
        "seasons": [
            (1, "Arabic-work-s1"),
            (2, "Arabic-work-s2"),
            (3, "Arabic-work-s3"),
            (4, "Arabic-work-s4"),
        ],
    },
    {
        "slug": "the-cops",
        "title": "השוטרים",
        "seasons": [(1, "the_cops-s1"), (2, "the_cops-s2")],
        "force": True,
    },
    {
        "slug": "she-is-with-me",
        "title": "להיות איתה",
        "seasons": [
            (1, "she-is-with-me-s1"),
            (2, "she-is-with-me-s2"),
            (3, "she-is-with-me-s3"),
        ],
        "force": True,
    },
    {
        "slug": "waking-bears",
        "title": "להעיר את הדב",
        "seasons": [(1, "waking-bears-s-1")],
    },
    {
        "slug": "mommy",
        "title": "אמא'לה",
        "seasons": [(1, "mommy-s1"), (2, "mommy-s2"), (3, "mommy-s3")],
    },
    {
        "slug": "nutuk-drama",
        "title": "נוטוק",
        "seasons": [(1, "nutuk_drama"), (1, "nutuk_drama-s1")],  # dedupe later
    },
    {
        "slug": "bufor",
        "title": "בופור",
        "seasons": [(1, "bufor-s1")],
    },
    {
        "slug": "the-new-rich",
        "title": "העשירים החדשים",
        "seasons": [(1, "the_new_rich-s1"), (1, "the_new_rich")],
    },
]


def fetch(url: str, retries: int = 4) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept-Language": "he-IL,he;q=0.9",
                    "Accept": "text/html,application/json,*/*",
                    "Referer": "https://www.mako.co.il/mako-vod-index",
                },
            )
            with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
                body = r.read()
            head = body[:1200].decode("utf-8", "ignore").lower()
            if "radware" in head or "shieldsquare" in head:
                raise RuntimeError("Radware block")
            return body
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 404:
                raise
            time.sleep(DELAY * (2 + i * 2))
        except Exception as e:
            last = e
            time.sleep(DELAY * (2 + i * 2))
            print(f"  retry {i+1}: {e}")
    raise last  # type: ignore


def fetch_text(url: str) -> str:
    return fetch(url).decode("utf-8", "ignore")


def parse_next(html: str):
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    return json.loads(m.group(1)) if m else None


def to_akamai(u: str | None) -> str | None:
    if not u:
        return u
    if "mako-vod.akamaized.net" in u:
        return u
    u = re.sub(r"https://[^/]+/hls/", "https://mako-vod.akamaized.net/i/", u)
    return u.replace("/index.m3u8", "/master.m3u8")


def ticket_ok(stream: str) -> bool:
    api = (
        "https://mass.mako.co.il/ClicksStatistics/entitlementsServicesV2.jsp?"
        + urllib.parse.urlencode({"et": "gt", "lp": stream, "rv": "AKAMAI"})
    )
    j = json.loads(fetch(api).decode())
    t = j["tickets"][0]["ticket"]
    url = stream + ("&" if "?" in stream else "?") + t
    return fetch(url).decode("utf-8", "ignore").startswith("#EXTM3U")


def list_episodes(season_path: str) -> list[str]:
    url = f"https://www.mako.co.il/mako-vod-keshet/{season_path}"
    html = fetch_text(url)
    time.sleep(DELAY)
    hrefs = []
    for m in re.finditer(
        rf'href="(/mako-vod-keshet/{re.escape(season_path)}/VOD-[A-Za-z0-9]+\.htm)"',
        html,
        re.I,
    ):
        # keep exact casing from match
        if m.group(1) not in hrefs:
            hrefs.append(m.group(1))
    if not hrefs:
        # any vod under this show family token
        token = re.sub(r"-s-?\d+$", "", season_path, flags=re.I)
        for m in re.finditer(
            r'href="(/mako-vod-keshet/[^"]+/VOD-[A-Za-z0-9]+\.htm)"', html
        ):
            if re.search(re.escape(token), m.group(1), re.I) and m.group(1) not in hrefs:
                hrefs.append(m.group(1))
    return hrefs


def scrape_episode(page_url: str, season: int, ep_hint: int) -> dict:
    html = fetch_text(page_url)
    time.sleep(DELAY)
    data = parse_next(html)
    stream = title = image = vcm = ch = None
    ep = ep_hint
    title = f"פרק {ep_hint}"
    if data:
        page = data["props"]["pageProps"]["data"]
        vod = page.get("vod") or {}
        schema = (page.get("seo") or {}).get("schema") or {}
        video = schema.get("video") or {}
        stream = to_akamai(video.get("contentUrl"))
        title = schema.get("name") or title
        image = schema.get("image") or video.get("thumbnailUrl")
        vcm = vod.get("itemVcmId") or vod.get("galleryChannelId")
        ch = vod.get("channelId")
        try:
            if schema.get("episodeNumber"):
                ep = int(schema["episodeNumber"])
        except Exception:
            pass
    if not stream and vcm and ch:
        pl = (
            "https://www.mako.co.il/AjaxPage?jspName=playlist.jsp"
            f"&galleryChannelId={urllib.parse.quote(vcm)}"
            f"&videoChannelId={urllib.parse.quote(ch)}"
            f"&vcmid={urllib.parse.quote(vcm)}"
            "&isGallery=false&consumer=web_html5&encryption=no"
        )
        try:
            pj = json.loads(fetch(pl).decode())
            time.sleep(DELAY * 0.4)
            media = pj.get("media") or []
            ak = [x for x in media if x.get("cdn") == "AKAMAI"]
            stream = to_akamai((ak[0] if ak else media[0])["url"])
        except Exception as e:
            print("    playlist", e)
    ok = False
    if stream:
        try:
            ok = ticket_ok(stream)
            time.sleep(DELAY * 0.35)
        except Exception as e:
            print("    ticket", e)
    return {
        "ep": ep,
        "season": season,
        "name": title,
        "pageURL": page_url,
        "streamURL": stream,
        "makoVcmId": vcm,
        "makoChannelId": ch,
        "imageRemote": image,
        "streamOk": ok,
    }


def save_image(url: str | None, dest_rel: str) -> str | None:
    if not url:
        return None
    dest = os.path.join(ROOT, dest_rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        open(dest, "wb").write(fetch(url))
        time.sleep(DELAY * 0.3)
        return dest_rel
    except Exception as e:
        print("    img", e)
        return None


def scrape_job(job: dict) -> dict:
    slug = job["slug"]
    title = job["title"]
    out_json = os.path.join(ROOT, "scripts", f"mako-{slug}.json")
    done = {}
    if os.path.exists(out_json) and not job.get("force"):
        prev = json.load(open(out_json, encoding="utf-8"))
        eps = prev.get("episodes") or []
        if eps and all(e.get("streamOk") for e in eps) and len(eps) >= 3:
            # still may be incomplete seasons — continue if force not set but seasons missing
            pass
        for e in eps:
            if e.get("streamOk") and e.get("pageURL"):
                done[e["pageURL"]] = e

    if job.get("force") and os.path.exists(out_json):
        # keep OK cache but rebuild list from all seasons
        prev = json.load(open(out_json, encoding="utf-8"))
        for e in prev.get("episodes") or []:
            if e.get("streamOk") and e.get("pageURL"):
                done[e["pageURL"]] = e

    print(f"==== {slug} ({title}) cache={len(done)}")
    episodes = []
    seen_paths = set()
    for season, season_path in job["seasons"]:
        if season_path.lower() in seen_paths:
            continue
        seen_paths.add(season_path.lower())
        print(f"  season {season} path={season_path}")
        try:
            hrefs = list_episodes(season_path)
        except Exception as e:
            print(f"  list fail: {e}")
            time.sleep(4)
            continue
        print(f"  found {len(hrefs)} eps")
        for i, path in enumerate(hrefs):
            page = "https://www.mako.co.il" + path
            if page in done:
                print(f"  - s{season}~{i+1} CACHED")
                episodes.append(done[page])
                continue
            print(f"  - s{season}~{i+1} {path[-50:]}")
            try:
                ep = scrape_episode(page, season, i + 1)
            except Exception as e:
                print(f"    FAIL {e}")
                time.sleep(5)
                ep = {
                    "ep": i + 1,
                    "season": season,
                    "name": f"פרק {i+1}",
                    "pageURL": page,
                    "streamURL": None,
                    "streamOk": False,
                }
            img = f"images/kanbox/{slug}/s{season}-ep{ep['ep']}.jpg"
            if not ep.get("localImage"):
                ep["localImage"] = save_image(ep.get("imageRemote"), img)
            episodes.append(ep)
            out = {
                "slug": slug,
                "title": title,
                "source": "mako",
                "pageURL": f"https://www.mako.co.il/mako-vod-keshet/{job['seasons'][0][1]}",
                "localPoster": f"images/kanbox/{slug}/series.jpg",
                "episodes": episodes,
            }
            json.dump(out, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # dedupe by pageURL preserving order
    uniq = []
    seen = set()
    for e in episodes:
        u = e.get("pageURL")
        if u in seen:
            continue
        seen.add(u)
        uniq.append(e)
    episodes = uniq

    # poster from first image
    poster = f"images/kanbox/{slug}/series.jpg"
    first = next((e.get("localImage") for e in episodes if e.get("localImage")), None)
    if first and not os.path.exists(os.path.join(ROOT, poster)):
        os.makedirs(os.path.dirname(os.path.join(ROOT, poster)), exist_ok=True)
        open(os.path.join(ROOT, poster), "wb").write(
            open(os.path.join(ROOT, first), "rb").read()
        )

    out = {
        "slug": slug,
        "title": title,
        "source": "mako",
        "pageURL": f"https://www.mako.co.il/mako-vod-keshet/{job['seasons'][0][1]}",
        "localPoster": poster,
        "episodes": episodes,
    }
    json.dump(out, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    ok = sum(1 for e in episodes if e.get("streamOk"))
    print(f"DONE {slug}: {ok}/{len(episodes)}")
    return out


def main():
    print("Cooling 12s before scrape…")
    time.sleep(12)
    for job in JOBS:
        try:
            scrape_job(job)
        except Exception as e:
            print(f"JOB FAIL {job['slug']}: {e}")
            time.sleep(8)


if __name__ == "__main__":
    main()
