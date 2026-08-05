#!/usr/bin/env python3
"""Fetch TV4 Halv åtta hos mig seasons >= 25 into scripts/tv4-halv-atta-hos-mig.json."""
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
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
GQL = "https://client-gateway.tv4.a2d.tv/graphql"
PROGRAM_ID = "2cec9a9f7ab85bb7a04c"
SLUG = "halv-atta-hos-mig"
MIN_SEASON = 25
OUT_JSON = os.path.join(ROOT, "scripts", f"tv4-{SLUG}.json")
DELAY = 0.35


def fetch(url: str, data: bytes | None = None, headers: dict | None = None) -> bytes:
    h = {
        "User-Agent": UA,
        "Accept": "application/json,text/html,*/*",
        "Accept-Language": "sv-SE,sv;q=0.9",
        "Origin": "https://www.tv4play.se",
        "Referer": "https://www.tv4play.se/",
    }
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h, method="POST" if data else "GET")
    with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
        return r.read()


def gql(query: str, variables: dict | None = None) -> dict:
    body: dict = {"query": query}
    if variables is not None:
        body["variables"] = variables
    raw = fetch(
        GQL,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "client-name": "tv4play-web",
            "client-version": "4.0.0",
        },
    )
    return json.loads(raw.decode())


def compress_jpeg(path: str) -> None:
    try:
        import subprocess
        subprocess.run(
            ["sips", "-Z", "720", "-s", "format", "jpeg", "-s", "formatOptions", "70", path, "--out", path],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception:
        pass


def save_image(url: str | None, dest_rel: str) -> str | None:
    if not url:
        return None
    dest = os.path.join(ROOT, dest_rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        return dest_rel
    try:
        open(dest, "wb").write(fetch(url))
        compress_jpeg(dest)
        time.sleep(DELAY * 0.4)
        return dest_rel
    except Exception as e:
        print(f"    img fail: {e}")
        return None


def season_num(title: str) -> int | None:
    m = re.search(r"(\d+)", title or "")
    return int(m.group(1)) if m else None


def list_season_episodes(season_id: str) -> list[dict]:
    q = """
    query($id: ID!, $input: SeasonEpisodesInput!) {
      season(id: $id) {
        episodes(input: $input) {
          items {
            id
            title
            episodeNumber
            slug
            images { main16x9 { source } }
          }
          pageInfo { hasNextPage }
        }
      }
    }
    """
    items: list[dict] = []
    offset = 0
    while True:
        res = gql(q, {"id": season_id, "input": {"offset": offset, "limit": 50}})
        block = (((res.get("data") or {}).get("season") or {}).get("episodes") or {})
        batch = block.get("items") or []
        items.extend(batch)
        if not batch or not (block.get("pageInfo") or {}).get("hasNextPage"):
            break
        offset += len(batch)
        time.sleep(DELAY)
    return items


def main():
    print("==== halv-atta-hos-mig (TV4)")
    res = gql(
        """
        query($id: ID!) {
          series(id: $id) {
            id
            title
            images { main16x9 { source } poster2x3 { source } }
            allSeasonLinks { id title }
          }
        }
        """,
        {"id": PROGRAM_ID},
    )
    series = (res.get("data") or {}).get("series") or {}
    title = series.get("title") or "Halv åtta hos mig"
    seasons = []
    for link in series.get("allSeasonLinks") or []:
        num = season_num(link.get("title") or "")
        if num is not None and num >= MIN_SEASON:
            seasons.append((num, link["id"], link.get("title") or f"Säsong {num}"))
    seasons.sort(key=lambda x: x[0])
    print(f"  title={title} seasons={[s[0] for s in seasons]}")

    poster_src = ((series.get("images") or {}).get("main16x9") or {}).get("source")
    poster = f"images/kanbox/{SLUG}/series.jpg"
    save_image(poster_src, poster)

    episodes: list[dict] = []
    for num, sid, stitle in seasons:
        print(f"  {stitle} ({sid})")
        items = list_season_episodes(sid)
        print(f"    {len(items)} episodes")
        for item in items:
            ep = int(item.get("episodeNumber") or 0)
            img = ((item.get("images") or {}).get("main16x9") or {}).get("source")
            local = f"images/kanbox/{SLUG}/s{num}-ep{ep}.jpg"
            local_ok = save_image(img, local)
            print(f"    - s{num} ep{ep} {item.get('title')}")
            episodes.append(
                {
                    "ep": ep,
                    "season": num,
                    "name": item.get("title") or f"Avsnitt {ep}",
                    "pageURL": (
                        f"https://www.tv4play.se/video/{item['id']}/"
                        f"{item.get('slug') or ''}"
                    ),
                    "assetId": item.get("id"),
                    "streamResolve": "tv4",
                    "streamURL": "",
                    "imageRemote": img,
                    "localImage": local_ok or local,
                    "defaultSubtitles": "sv",
                    "preferHlsJs": True,
                }
            )

    out = {
        "slug": SLUG,
        "title": title,
        "source": "sweden",
        "pageURL": f"https://www.tv4play.se/program/{PROGRAM_ID}/halv-atta-hos-mig",
        "localPoster": poster,
        "defaultSubtitles": "sv",
        "preferHlsJs": True,
        "episodes": sorted(episodes, key=lambda e: (e["season"], e["ep"])),
    }
    json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    ok_img = sum(1 for e in episodes if e.get("localImage") and os.path.exists(e["localImage"]))
    print(f"DONE {len(episodes)} episodes, images {ok_img}/{len(episodes)}")


if __name__ == "__main__":
    main()
