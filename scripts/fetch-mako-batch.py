#!/usr/bin/env python3
"""Batch-scrape Mako/Keshet VOD series into scripts/mako-<slug>.json + images."""
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
DELAY = 1.15

SERIES = [
    # (slug, mako path as in URL, hebrew fallback title)
    ("the-property", "the_property", "הנחלה"),
    ("arabic-work", "arabic-work", "עבודה ערבית"),
    ("the-head", "the_head", "הראש"),
    ("the-cops", "the_cops", "השוטרים"),
    ("a-body-that-works", "a_body_that_works", "גוף שעובד"),
    ("she-is-with-me", "she-is-with-me", "היא איתי"),
    ("ismach-chatani", "ismach_chatani", "ישמח חתני"),
    ("waking-bears", "waking-bears", "מעירים דובים"),
    ("mommy", "mommy", "מאמי"),
    ("nutuk-drama", "nutuk_drama", "נוטוק"),
    ("bufor", "bufor", "בופור"),
    ("the-new-rich", "the_new_rich", "העשירים החדשים"),
]


def fetch(url: str, retries: int = 5, allow_404: bool = False) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept": "text/html,application/xhtml+xml,application/json,*/*",
                    "Referer": "https://www.mako.co.il/mako-vod-index",
                    "Cache-Control": "no-cache",
                },
            )
            with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
                body = r.read()
            text = body[:800].decode("utf-8", "ignore").lower()
            if "radware" in text or "shieldsquare" in text:
                raise RuntimeError("Radware block")
            return body
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 404 and not allow_404:
                raise
            if e.code == 404:
                raise
            wait = DELAY * (2 + i * 2)
            print(f"  retry {i+1}/{retries} after {wait:.1f}s: {e}")
            time.sleep(wait)
        except Exception as e:
            last = e
            wait = DELAY * (2 + i * 2)
            print(f"  retry {i+1}/{retries} after {wait:.1f}s: {e}")
            time.sleep(wait)
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
    u = u.replace("/index.m3u8", "/master.m3u8")
    return u


def ticket_ok(stream: str) -> bool:
    api = (
        "https://mass.mako.co.il/ClicksStatistics/entitlementsServicesV2.jsp?"
        + urllib.parse.urlencode({"et": "gt", "lp": stream, "rv": "AKAMAI"})
    )
    j = json.loads(fetch(api).decode())
    t = j["tickets"][0]["ticket"]
    url = stream + ("&" if "?" in stream else "?") + t
    body = fetch(url).decode("utf-8", "ignore")
    return body.startswith("#EXTM3U")


def clean_title(raw: str, fallback: str) -> str:
    t = (raw or fallback).split("|")[0].strip()
    t = re.sub(r"\s*[-–—,]\s*עונה\s*\d+.*$", "", t)
    t = re.sub(r"\s*,\s*עונה\s*\d+.*$", "", t)
    t = re.sub(r"\s+עונה\s*\d+.*$", "", t)
    t = re.sub(r"\s*פרקים מלאים.*$", "", t)
    t = re.sub(r"\s*לצפייה ישירה.*$", "", t)
    t = t.strip(" -–—,")
    return t.strip() or fallback


def discover_season_paths(family: str, html: str) -> list[tuple[int, str]]:
    """Return [(season_num, path)] unique, sorted. Paths keep site casing."""
    paths: dict[int, str] = {}
    fam_re = re.escape(family)

    def remember(season: int, path: str):
        cur = paths.get(season)
        if cur is None:
            paths[season] = path
        elif re.search(rf"-s{season}$", path, re.I) and not re.search(
            rf"-s{season}$", cur, re.I
        ):
            paths[season] = path

    # Season nav links (case-insensitive family)
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/mako-vod-keshet/({fam_re}-s(\d+))(?:/|"|\?)',
        html,
        re.I,
    ):
        remember(int(m.group(2)), m.group(1))
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/mako-vod-keshet/({fam_re})(?:/|"|\?)',
        html,
        re.I,
    ):
        remember(1, m.group(1))

    # Episode hrefs reveal season paths + casing
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/mako-vod-keshet/({fam_re}-s(\d+))/VOD-[A-Za-z0-9]+\.htm"',
        html,
        re.I,
    ):
        remember(int(m.group(2)), m.group(1))
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/mako-vod-keshet/({fam_re})/VOD-[A-Za-z0-9]+\.htm"',
        html,
        re.I,
    ):
        remember(1, m.group(1))

    if not paths:
        paths[1] = family
    return sorted(paths.items())


def episode_hrefs_for_season(html: str, family: str, season: int, season_path: str) -> list[str]:
    hrefs = []
    patterns = [
        rf'href="(/mako-vod-keshet/{re.escape(season_path)}/VOD-[A-Za-z0-9]+\.htm)"',
        rf'href="(/mako-vod-keshet/{re.escape(family)}-s{season}/VOD-[A-Za-z0-9]+\.htm)"',
        rf'href="(/mako-vod-keshet/{re.escape(family)}-s{season}/VOD-[A-Za-z0-9]+\.htm)"',
    ]
    # case-insensitive family variants
    patterns.append(
        rf'href="(/mako-vod-keshet/{re.escape(family)}-s{season}/VOD-[A-Za-z0-9]+\.htm)"'
    )
    patterns.append(
        rf'href="(/mako-vod-keshet/(?i:{re.escape(family)})-s{season}/VOD-[A-Za-z0-9]+\.htm)"'
    )
    if season == 1:
        patterns.append(
            rf'href="(/mako-vod-keshet/{re.escape(family)}/VOD-[A-Za-z0-9]+\.htm)"'
        )
        patterns.append(
            rf'href="(/mako-vod-keshet/(?i:{re.escape(family)})/VOD-[A-Za-z0-9]+\.htm)"'
        )

    for pat in patterns:
        try:
            for m in re.finditer(pat, html):
                if m.group(1) not in hrefs:
                    hrefs.append(m.group(1))
        except re.error:
            continue

    # Fallback: any VOD under this season_path ignoring case
    if not hrefs:
        for m in re.finditer(
            rf'href="(/mako-vod-keshet/{re.escape(season_path)}/VOD-[A-Za-z0-9]+\.htm)"',
            html,
            re.I,
        ):
            # normalize to matched casing from html
            full = m.group(1)
            # re-find exact casing
            exact = re.search(re.escape(full), html, re.I)
            path = html[exact.start() : exact.end()] if exact else full
            # extract from href more carefully
            pass
        for m in re.finditer(
            rf'href="(/mako-vod-keshet/[^"]+/VOD-[A-Za-z0-9]+\.htm)"', html
        ):
            path = m.group(1)
            if re.search(rf"/mako-vod-keshet/{re.escape(family)}-s{season}/", path, re.I) or (
                season == 1
                and re.search(rf"/mako-vod-keshet/{re.escape(family)}/", path, re.I)
                and not re.search(r"-s\d+/", path, re.I)
            ):
                if path not in hrefs:
                    hrefs.append(path)
    return hrefs


def scrape_episode(page_url: str, season: int, ep_hint: int) -> dict:
    html = fetch_text(page_url)
    time.sleep(DELAY)
    data = parse_next(html)
    stream = None
    title = f"פרק {ep_hint}"
    image = None
    vcm = None
    ch = None
    ep = ep_hint

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
            time.sleep(DELAY * 0.5)
            media = pj.get("media") or []
            ak = [x for x in media if x.get("cdn") == "AKAMAI"]
            stream = to_akamai((ak[0] if ak else media[0])["url"])
            title = (pj.get("videoDetails") or {}).get("title") or title
        except Exception as e:
            print(f"    playlist fail: {e}")

    ok = False
    if stream:
        try:
            ok = ticket_ok(stream)
            time.sleep(DELAY * 0.4)
        except Exception as e:
            print(f"    ticket fail: {e}")
            try:
                stream = to_akamai(stream)
                ok = ticket_ok(stream)
            except Exception as e2:
                print(f"    ticket2 fail: {e2}")

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
        time.sleep(DELAY * 0.35)
        return dest_rel
    except Exception as e:
        print(f"    img fail: {e}")
        return None


def scrape_series(slug: str, family: str, fallback_title: str) -> dict:
    out_json = os.path.join(ROOT, "scripts", f"mako-{slug}.json")
    if os.path.exists(out_json):
        existing = json.load(open(out_json, encoding="utf-8"))
        if existing.get("episodes") and all(e.get("streamOk") for e in existing["episodes"]):
            print(f"SKIP complete {slug} ({len(existing['episodes'])} eps)")
            return existing

    print(f"==== {slug} / {family}")
    base_url = f"https://www.mako.co.il/mako-vod-keshet/{family}"
    # the_cops user linked -s1; try base then -s1
    try:
        html = fetch_text(base_url)
    except Exception:
        html = fetch_text(base_url + "-s1")
        family_for_discover = family
    else:
        family_for_discover = family
    time.sleep(DELAY)

    title_m = re.search(r"<title>([^<]+)</title>", html)
    title = clean_title(title_m.group(1) if title_m else "", fallback_title)
    seasons = discover_season_paths(family_for_discover, html)
    print(f"  title={title} seasons={seasons}")

    # Probe a few extra seasons without burning retries on 404
    max_seen = max((s for s, _ in seasons), default=1)
    for n in range(1, max(max_seen + 2, 3)):
        path = f"{family}-s{n}"
        if any(p == path for _, p in seasons):
            continue
        url = f"https://www.mako.co.il/mako-vod-keshet/{path}"
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": UA, "Referer": "https://www.mako.co.il/mako-vod-index"},
            )
            with urllib.request.urlopen(req, context=CTX, timeout=25) as r:
                sh = r.read().decode("utf-8", "ignore")
            time.sleep(DELAY * 0.6)
        except Exception:
            continue
        if "Radware" in sh[:2000] or "shieldsquare" in sh[:2000].lower():
            time.sleep(3)
            continue
        hrefs = episode_hrefs_for_season(sh, family, n, path)
        if hrefs:
            seasons.append((n, path))
            print(f"  found extra season {n} ({len(hrefs)} eps)")
    seasons = sorted(set(seasons))

    # Resume: keep already-OK episodes by pageURL
    done_by_page = {}
    if os.path.exists(out_json):
        try:
            prev = json.load(open(out_json, encoding="utf-8"))
            for e in prev.get("episodes") or []:
                if e.get("streamOk") and e.get("streamURL") and e.get("pageURL"):
                    done_by_page[e["pageURL"]] = e
            print(f"  resume cache: {len(done_by_page)} ok episodes")
        except Exception:
            pass

    poster = None
    for pat in [
        rf'https://img\.mako\.co\.il/[^"\']+{re.escape(family)}[^"\']*_x5[^"\']*\.jpg',
        r'https://img\.mako\.co\.il/[^"\']+_x5[^"\']*\.jpg',
        r'https://img\.mako\.co\.il/[^"\']+_i\.jpg',
    ]:
        m = re.search(pat, html, re.I)
        if m:
            poster = m.group(0)
            break

    episodes: list[dict] = []
    for season, season_path in seasons:
        surl = f"https://www.mako.co.il/mako-vod-keshet/{season_path}"
        print(f"  season page {surl}")
        try:
            sh = fetch_text(surl)
        except Exception as e:
            print(f"  season fail {e}")
            continue
        time.sleep(DELAY)
        hrefs = episode_hrefs_for_season(sh, family, season, season_path)
        print(f"  season {season}: {len(hrefs)} episodes")
        for i, path in enumerate(hrefs):
            page = "https://www.mako.co.il" + path
            if page in done_by_page:
                ep = done_by_page[page]
                print(f"  - s{season} ep~{i+1} CACHED ok")
                episodes.append(ep)
                continue
            print(f"  - s{season} ep~{i+1} {path[-45:]}")
            try:
                ep = scrape_episode(page, season, i + 1)
            except Exception as e:
                print(f"    FAIL {e}")
                ep = {
                    "ep": i + 1,
                    "season": season,
                    "name": f"פרק {i+1}",
                    "pageURL": page,
                    "streamURL": None,
                    "streamOk": False,
                }
            img_rel = f"images/kanbox/{slug}/s{season}-ep{ep['ep']}.jpg"
            if not ep.get("localImage"):
                ep["localImage"] = save_image(ep.get("imageRemote"), img_rel)
            episodes.append(ep)
            # checkpoint
            partial = {
                "slug": slug,
                "title": title,
                "source": "mako",
                "pageURL": base_url,
                "localPoster": f"images/kanbox/{slug}/series.jpg",
                "episodes": episodes,
            }
            json.dump(
                partial,
                open(out_json, "w", encoding="utf-8"),
                ensure_ascii=False,
                indent=2,
            )

    # renumber collisions within season
    for season in {e["season"] for e in episodes}:
        group = [e for e in episodes if e["season"] == season]
        nums = [e["ep"] for e in group]
        if len(nums) != len(set(nums)):
            for i, e in enumerate(group):
                e["ep"] = i + 1

    series_poster = f"images/kanbox/{slug}/series.jpg"
    if poster:
        save_image(poster, series_poster)
    elif episodes:
        # copy first episode image
        first_img = next((e.get("localImage") for e in episodes if e.get("localImage")), None)
        if first_img:
            src = os.path.join(ROOT, first_img)
            dst = os.path.join(ROOT, series_poster)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if os.path.exists(src):
                open(dst, "wb").write(open(src, "rb").read())

    out = {
        "slug": slug,
        "title": title,
        "source": "mako",
        "pageURL": base_url,
        "localPoster": series_poster,
        "episodes": episodes,
    }
    json.dump(out, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    ok = sum(1 for e in episodes if e.get("streamOk"))
    print(f"DONE {slug}: {ok}/{len(episodes)} streams ok")
    return out


def main():
    # Special: user linked the_cops-s1 — ensure family the_cops works
    results = []
    for slug, family, title in SERIES:
        try:
            results.append(scrape_series(slug, family, title))
        except Exception as e:
            print(f"SERIES FAIL {slug}: {e}")
            time.sleep(5)
    print("==== SUMMARY ====")
    for r in results:
        eps = r.get("episodes") or []
        print(
            r.get("slug"),
            r.get("title"),
            f"{sum(1 for e in eps if e.get('streamOk'))}/{len(eps)}",
        )


if __name__ == "__main__":
    main()
