#!/usr/bin/env python3
"""Fetch Reshet 13 VOD series via Kaltura OTT API into scripts/reshet-<slug>.json + images."""
from __future__ import annotations

import json
import os
import re
import ssl
import time
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BASE = "https://5031.frp1.ott.kaltura.com/api_v3/service/"
CTX = ssl.create_default_context()
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)

# (slug, seriesId, hebrew title fallback)
SERIES = [
    ("ha-maabara", 718, "המעברה"),
    ("wart", 613, "ווארט"),
    ("shnot-ha-80", 30, "שנות ה-80"),
    ("blackspace", 87, "בלקספייס"),
    ("ehad-haam-1", 417, "אחד העם 1"),
    ("ehad-haam-101", 273, "אחד העם 101"),
    ("zot-vezoti", 123, "זאת וזאתי"),
    ("yaniv", 537, "יניב"),
    ("litzvi-yesh-beaya", 84, "לצבי יש בעיה"),
    ("amammiot", 210, "עממיות"),
    ("haisraelim", 141, "הישראלים"),
    ("hamitnachel", 171, "המתנחל עם חנוך דאום"),
    ("lo-lifnei-hayeladim", 441, "לא לפני הילדים"),
    ("haerev-etzel-ben", 535, "הערב אצל בן בן ברוך"),
    ("magen-david-darom", 174, "מגן דוד דרום"),
    ("asenheim", 723, "אסנהיים"),
    ("patrick", 655, "פטריק"),
    ("shnot-ha-90", 18, "שנות ה-90"),
    ("nevsu", 262, "נבסו"),
    ("televizya-mehaatid", 90, "טלוויזיה מהעתיד"),
    ("power-couple", 728, "פאוור קאפל"),
    ("haaretz-hamuvtachat", 737, "הארץ המובטחת"),
    ("leehov-et-ana", 443, "לאהוב את אנה"),
]


def post(action: str, payload: dict) -> dict:
    req = urllib.request.Request(
        BASE + action,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": UA,
            "Referer": "https://13tv.co.il/",
            "Origin": "https://13tv.co.il",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
        return json.loads(r.read().decode())


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Referer": "https://13tv.co.il/"}
    )
    with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
        return r.read()


def meta_val(metas: dict, key: str):
    m = (metas or {}).get(key)
    if not m:
        return None
    if isinstance(m, dict) and "value" in m:
        return m["value"]
    return m


def tag_val(tags: dict, key: str):
    t = (tags or {}).get(key)
    if not t:
        return None
    objs = t.get("objects") if isinstance(t, dict) else None
    if objs and isinstance(objs, list) and objs:
        return objs[0].get("value")
    if isinstance(t, dict) and "value" in t:
        return t["value"]
    return None


def img_url(images: list, prefer=("16x9", "Landscape"), w=640, h=360) -> str | None:
    if not images:
        return None
    by_type = {im.get("imageTypeName"): im for im in images if im.get("url")}
    for name in prefer:
        if name in by_type:
            return f"{by_type[name]['url']}/width/{w}/height/{h}"
    first = next((im for im in images if im.get("url")), None)
    return f"{first['url']}/width/{w}/height/{h}" if first else None


def login_ks() -> str:
    j = post(
        "ottuser/action/anonymouslogin",
        {"partnerId": 5031, "udid": "ISRTV-BATCH", "apiVersion": "5.4.0"},
    )
    return j["result"]["ks"]


def list_all_episodes(ks: str, series_id: int) -> list[dict]:
    page = 1
    out: list[dict] = []
    while True:
        j = post(
            "asset/action/list",
            {
                "apiVersion": "5.4.0",
                "ks": ks,
                "filter": {
                    "objectType": "KalturaSearchAssetFilter",
                    "kSql": f"(and SeriesID='{series_id}')",
                },
                "pager": {
                    "objectType": "KalturaFilterPager",
                    "pageSize": 50,
                    "pageIndex": page,
                },
            },
        )
        res = j.get("result") or {}
        objs = res.get("objects") or []
        out.extend(objs)
        total = res.get("totalCount") or 0
        if not objs or len(out) >= total:
            break
        page += 1
        time.sleep(0.25)
    # Keep Episode media only (type 1268 typically); drop Series shell if present
    episodes = []
    for o in out:
        media_type = meta_val(o.get("metas") or {}, "MediaType")
        if media_type and str(media_type).lower() == "series":
            continue
        ext_id = str(o.get("externalId") or "")
        if o.get("typeDescription") == "Series" or ext_id.startswith("Show-") or ext_id.startswith(
            "Season-"
        ):
            continue
        if re.fullmatch(r"עונה\s+\d+", str(o.get("name") or "").strip()):
            continue
        # Prefer items with entryId (playable)
        if not o.get("entryId") and not o.get("id"):
            continue
        episodes.append(o)
    return episodes


def get_show(ks: str, series_id: int) -> dict | None:
    # Try externalId Show-{id}
    try:
        j = post(
            "asset/action/list",
            {
                "apiVersion": "5.4.0",
                "ks": ks,
                "filter": {
                    "objectType": "KalturaSearchAssetFilter",
                    "kSql": f"(and externalId='Show-{series_id}')",
                },
                "pager": {
                    "objectType": "KalturaFilterPager",
                    "pageSize": 5,
                    "pageIndex": 1,
                },
            },
        )
        objs = (j.get("result") or {}).get("objects") or []
        if objs:
            return objs[0]
    except Exception:
        pass
    return None


def ep_sort_key(o: dict):
    metas = o.get("metas") or {}
    season = meta_val(metas, "SeasonNumber") or 1
    ep = meta_val(metas, "EpisodeNumber")
    if ep is None:
        m = re.search(r"פרק\s+(\d+)", o.get("name") or "")
        ep = int(m.group(1)) if m else 999
    try:
        season = int(float(season))
    except Exception:
        season = 1
    try:
        ep = int(float(ep))
    except Exception:
        ep = 999
    return season, ep, o.get("id") or 0


def scrape_one(ks: str, slug: str, series_id: int, title_fb: str) -> dict:
    print(f"=== {slug} ({series_id})")
    show = get_show(ks, series_id)
    title = (show or {}).get("name") or title_fb
    raw = list_all_episodes(ks, series_id)
    raw.sort(key=ep_sort_key)
    print(f"  episodes from API: {len(raw)} title={title}")

    outdir = os.path.join(ROOT, "images", "kanbox", slug)
    os.makedirs(outdir, exist_ok=True)

    episodes = []
    for o in raw:
        metas = o.get("metas") or {}
        season = meta_val(metas, "SeasonNumber") or 1
        epn = meta_val(metas, "EpisodeNumber")
        try:
            season = int(float(season))
        except Exception:
            season = 1
        if epn is None:
            m = re.search(r"פרק\s+(\d+)", o.get("name") or "")
            epn = int(m.group(1)) if m else (len(episodes) + 1)
        try:
            epn = int(float(epn))
        except Exception:
            epn = len(episodes) + 1

        name = o.get("name") or f"עונה {season} פרק {epn}"
        img_remote = img_url(o.get("images") or [])
        local = f"images/kanbox/{slug}/s{season}-ep{epn}.jpg"
        if img_remote:
            try:
                open(os.path.join(ROOT, local), "wb").write(fetch_bytes(img_remote))
            except Exception as e:
                print(f"  img fail s{season}e{epn}: {e}")
                local = None
        else:
            local = None

        episodes.append(
            {
                "ep": epn,
                "season": season,
                "name": name,
                "subtitle": (o.get("description") or "").strip(),
                "pageURL": f"https://13tv.co.il/allshows/series/{series_id}/season/{season}/{o.get('id')}/",
                "assetId": o.get("id"),
                "entryId": o.get("entryId"),
                "externalId": o.get("externalId"),
                "localImage": local,
                "imageRemote": img_remote,
            }
        )
        time.sleep(0.05)

    # Deduplicate by (season, ep) keeping first
    seen = set()
    deduped = []
    for e in episodes:
        key = (e["season"], e["ep"])
        if key in seen:
            # bump ep for extras (BTS etc.)
            e["ep"] = max(x["ep"] for x in deduped if x["season"] == e["season"]) + 1
            # also rename local image if needed
            if e.get("localImage"):
                new_local = f"images/kanbox/{slug}/s{e['season']}-ep{e['ep']}.jpg"
                src = os.path.join(ROOT, e["localImage"])
                dst = os.path.join(ROOT, new_local)
                if os.path.exists(src) and src != dst:
                    try:
                        os.replace(src, dst)
                    except Exception:
                        pass
                e["localImage"] = new_local
            key = (e["season"], e["ep"])
        seen.add(key)
        deduped.append(e)
    episodes = sorted(deduped, key=lambda e: (e["season"], e["ep"]))

    poster = f"images/kanbox/{slug}/series.jpg"
    poster_remote = img_url(
        (show or {}).get("images") or [], prefer=("16x9", "Landscape", "2x3"), w=1280, h=720
    )
    if poster_remote:
        try:
            open(os.path.join(ROOT, poster), "wb").write(fetch_bytes(poster_remote))
        except Exception as e:
            print(f"  poster fail: {e}")
            poster_remote = None
    if not poster_remote:
        first_img = next((e["localImage"] for e in episodes if e.get("localImage")), None)
        if first_img:
            open(os.path.join(ROOT, poster), "wb").write(
                open(os.path.join(ROOT, first_img), "rb").read()
            )
        else:
            poster = first_img

    out = {
        "slug": slug,
        "title": title,
        "source": "reshet",
        "pageURL": f"https://13tv.co.il/allshows/series/{series_id}/",
        "seriesId": series_id,
        "localPoster": poster,
        "episodes": episodes,
    }
    path = os.path.join(ROOT, "scripts", f"reshet-{slug}.json")
    json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    seasons = sorted({e["season"] for e in episodes})
    print(f"  DONE {len(episodes)} eps seasons={seasons} -> {path}")
    return out


def main():
    import sys

    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    ks = login_ks()
    for slug, sid, title in SERIES:
        if only and slug not in only and str(sid) not in only:
            continue
        try:
            scrape_one(ks, slug, sid, title)
        except Exception as e:
            print(f"FAIL {slug}: {e}")
            # refresh KS and retry once
            try:
                time.sleep(2)
                ks = login_ks()
                scrape_one(ks, slug, sid, title)
            except Exception as e2:
                print(f"FAIL2 {slug}: {e2}")
        time.sleep(0.5)
    print("ALL DONE")


if __name__ == "__main__":
    main()
