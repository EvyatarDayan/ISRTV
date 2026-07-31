#!/usr/bin/env python3
"""Scrape additional Mako N12 series."""
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
DELAY = 1.4

# (slug, title, [(season, season_path_with_section)])
# season_path is full after mako.co.il/ e.g. mako-vod-keshet/foo-s1 or mako-vod-bip/bar-s1
JOBS = [
    ("etti-alon", "אתי אלון", [(1, "mako-vod-keshet/etti_alon-s1")]),
    ("nicol-raidman", "החיים החדשים של ניקול ראידמן", [
        (1, "mako-vod-keshet/nicol_raidman_new_life-s1"),
        (1, "mako-vod-keshet/nicol_raidman_new_life"),
    ]),
    ("likudnikim", "הליכודניקים", [(1, "mako-vod-keshet/likudnikim-s1")]),
    ("dudu-topaz-case", "תיק דודו טופז", [(1, "mako-vod-keshet/dudu_topaz_case-s1")]),
    ("life-is-difficult", "החיים הם תקופה קשה", [(1, "mako-vod-keshet/life_is_difficult-s1")]),
    ("hanoch-daum-standup", "חנוך דאום - סטנדאפ", [
        (1, "mako-vod-keshet/hanoch_daum_standup-s1"),
        (1, "mako-vod-keshet/hanoch_daum_standup"),
    ]),
    ("avi-nussbaum-standup", "אבי נוסבאום - סטנדאפ", [
        (1, "mako-vod-keshet/avi_nussbaum_standup-s1")
    ]),
    ("ori-hizkiah", "אורי חזקיה – הופה לא קרה כלום", [
        (1, "mako-vod-keshet/ori_hizkiah_nothing_happened-s1")
    ]),
    ("hundred-percent-ashkenazi", "מאה אחוז אשכנזי", [
        (1, "mako-vod-keshet/hundred_percent_ashkenazi-s1"),
        (1, "mako-vod-keshet/hundred_percent_ashkenazi"),
    ]),
    ("avi-bitter", "אבי ביטר חי בסרט", [(1, "mako-vod-bip/avi_bitter-s1")]),
]


def fetch(url: str, retries: int = 5) -> bytes:
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
            head = body[:1500].decode("utf-8", "ignore").lower()
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
            print(f"  retry {i+1}: {e}")
            time.sleep(DELAY * (2 + i * 2))
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


def list_episodes(season_full_path: str) -> list[str]:
    """season_full_path like mako-vod-keshet/foo-s1"""
    url = "https://www.mako.co.il/" + season_full_path
    html = fetch_text(url)
    time.sleep(DELAY)
    # extract leaf folder name for matching
    leaf = season_full_path.split("/")[-1]
    section = season_full_path.split("/")[0]  # mako-vod-keshet or mako-vod-bip
    hrefs = []
    for m in re.finditer(
        rf'href="(/{re.escape(section)}/{re.escape(leaf)}/VOD-[A-Za-z0-9]+\.htm)"',
        html,
        re.I,
    ):
        if m.group(1) not in hrefs:
            hrefs.append(m.group(1))
    if not hrefs:
        # broader: any VOD under this section matching family token
        token = re.sub(r"-s-?\d+$", "", leaf, flags=re.I)
        for m in re.finditer(
            rf'href="(/{re.escape(section)}/[^"]+/VOD-[A-Za-z0-9]+\.htm)"', html
        ):
            if re.search(re.escape(token), m.group(1), re.I) and m.group(1) not in hrefs:
                hrefs.append(m.group(1))
    return hrefs


def scrape_episode(page_url: str, season: int, ep_hint: int) -> dict:
    html = fetch_text(page_url)
    time.sleep(DELAY)
    data = parse_next(html)
    stream = image = vcm = ch = None
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


def scrape_job(slug: str, title: str, seasons: list) -> dict:
    out_json = os.path.join(ROOT, "scripts", f"mako-{slug}.json")
    done = {}
    if os.path.exists(out_json):
        prev = json.load(open(out_json, encoding="utf-8"))
        for e in prev.get("episodes") or []:
            if e.get("streamOk") and e.get("pageURL"):
                done[e["pageURL"]] = e
        if done and all(
            e.get("streamOk") for e in (prev.get("episodes") or [])
        ) and len(prev.get("episodes") or []) >= 1:
            # If we already have episodes, still allow adding more seasons
            pass

    print(f"==== {slug} ({title}) cache={len(done)}")
    episodes = []
    seen_paths = set()
    for season, spath in seasons:
        if spath.lower() in seen_paths:
            continue
        seen_paths.add(spath.lower())
        print(f"  season {season} {spath}")
        try:
            hrefs = list_episodes(spath)
        except Exception as e:
            print(f"  list fail: {e}")
            time.sleep(5)
            continue
        print(f"  found {len(hrefs)}")
        for i, path in enumerate(hrefs):
            page = "https://www.mako.co.il" + path
            if page in done:
                print(f"  - s{season}~{i+1} CACHED")
                episodes.append(done[page])
                continue
            print(f"  - s{season}~{i+1} {path[-55:]}")
            try:
                ep = scrape_episode(page, season, i + 1)
            except Exception as e:
                print(f"    FAIL {e}")
                time.sleep(6)
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
                "pageURL": "https://www.mako.co.il/" + seasons[0][1],
                "localPoster": f"images/kanbox/{slug}/series.jpg",
                "episodes": episodes,
            }
            json.dump(out, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # dedupe
    uniq, seen = [], set()
    for e in episodes:
        u = e.get("pageURL")
        if u in seen:
            continue
        seen.add(u)
        uniq.append(e)
    episodes = uniq

    poster = f"images/kanbox/{slug}/series.jpg"
    first = next((e.get("localImage") for e in episodes if e.get("localImage")), None)
    if first:
        os.makedirs(os.path.dirname(os.path.join(ROOT, poster)), exist_ok=True)
        try:
            open(os.path.join(ROOT, poster), "wb").write(
                open(os.path.join(ROOT, first), "rb").read()
            )
        except Exception:
            pass

    out = {
        "slug": slug,
        "title": title,
        "source": "mako",
        "pageURL": "https://www.mako.co.il/" + seasons[0][1],
        "localPoster": poster,
        "episodes": episodes,
    }
    json.dump(out, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    ok = sum(1 for e in episodes if e.get("streamOk"))
    print(f"DONE {slug}: {ok}/{len(episodes)}")
    return out


def main():
    print("Cooling 8s…")
    time.sleep(8)
    for slug, title, seasons in JOBS:
        try:
            scrape_job(slug, title, seasons)
        except Exception as e:
            print(f"JOB FAIL {slug}: {e}")
            time.sleep(8)


if __name__ == "__main__":
    main()
