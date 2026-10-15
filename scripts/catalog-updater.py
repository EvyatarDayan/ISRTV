#!/usr/bin/env python3
"""
Build / refresh ISRTV catalog packages for watched series.

Preferred entry (Kan + Mako):
  python3 scripts/catalog-updater.py
  python3 scripts/catalog-updater.py --slug kupa-rashit
  python3 scripts/catalog-updater.py --seed-only

Mako scrape helper (used by the Node orchestrator):
  python3 scripts/catalog-updater.py --mako-only --slug life-is-difficult

Writes:
  scripts/catalog/manifest.json
  scripts/catalog/packages/<slug>.json
  scripts/catalog/media/<slug>/...
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "scripts" / "catalog"
WATCHLIST = CATALOG / "watchlist.json"
PACKAGES = CATALOG / "packages"
MEDIA = CATALOG / "media"
DELAY = 1.0


def fetch(url: str, referer: str = "https://www.mako.co.il/", retries: int = 5) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept-Language": "he-IL,he;q=0.9",
                    "Referer": referer,
                    "Accept": "*/*",
                },
            )
            with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
                body = r.read()
            text = body[:900].decode("utf-8", "ignore").lower()
            if "radware" in text or "shieldsquare" in text:
                raise RuntimeError("Radware block")
            return body
        except Exception as e:
            last = e
            wait = DELAY * (2 + i * 1.5)
            print(f"  retry {i+1}: {e} ({wait:.0f}s)", flush=True)
            time.sleep(wait)
    raise last  # type: ignore


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
    body = fetch(url, referer="https://www.mako.co.il/").decode("utf-8", "ignore")
    return body.startswith("#EXTM3U")


def save_image(url: str | None, dest: Path) -> str | None:
    if not url:
        return None
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        dest.write_bytes(fetch(url))
        time.sleep(DELAY * 0.2)
        return str(dest.relative_to(ROOT)).replace("\\", "/")
    except Exception as e:
        print(f"    img fail: {e}", flush=True)
        return None


def scrape_mako_series(item: dict) -> dict:
    slug = item["slug"]
    family = item.get("family") or slug.replace("-", "_")
    page_url = item["pageURL"]
    print(f"==== mako {slug}", flush=True)

    html = fetch(page_url).decode("utf-8", "ignore")
    time.sleep(DELAY)
    data = parse_next(html)
    if not data:
        raise RuntimeError("no __NEXT_DATA__")
    page = data["props"]["pageProps"]["data"]
    title = (
        ((page.get("seo") or {}).get("schema") or {}).get("name")
        or item.get("title")
        or slug
    )

    # Discover season pages from links + menu
    season_paths: dict[int, str] = {}
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/(mako-vod-keshet/{re.escape(family)}-s(\d+))(?:/|"|\?)',
        html,
        re.I,
    ):
        season_paths[int(m.group(2))] = m.group(1)
    for m in re.finditer(
        rf'href="(?:https://www\.mako\.co\.il)?/(mako-vod-keshet/{re.escape(family)})(?:/|"|\?)',
        html,
        re.I,
    ):
        season_paths.setdefault(1, m.group(1))

    def skip_path(purl: str) -> bool:
        p = (purl or "").lower()
        return any(x in p for x in ("credits", "specials", "shorts", "/articles"))

    for tab in page.get("menu") or []:
        purl = (tab.get("pageUrl") or "").lstrip("/")
        if skip_path(purl):
            continue
        sm = re.search(rf"{re.escape(family)}-s(\d+)", purl, re.I)
        if not sm:
            continue
        n = int(sm.group(1))
        prev = season_paths.get(n) or ""
        # Prefer the season root over a deeper sub-page
        if not prev or purl.count("/") < prev.count("/"):
            season_paths[n] = purl

    # Bare series URL is the hub, not season 1
    if 1 in season_paths and not re.search(r"-s1(?:/|$)", season_paths[1], re.I):
        del season_paths[1]
    season_paths = {n: p for n, p in season_paths.items() if not skip_path(p)}

    if not season_paths:
        season_paths[1] = f"mako-vod-keshet/{family}"

    print(f"  seasons: {sorted(season_paths.items())}", flush=True)

    episodes = []
    seen_pages = set()
    for season, spath in sorted(season_paths.items()):
        surl = "https://www.mako.co.il/" + spath.lstrip("/")
        print(f"  season page {surl}", flush=True)
        try:
            sh = fetch(surl, referer=page_url).decode("utf-8", "ignore")
            time.sleep(DELAY)
        except Exception as e:
            print(f"  season fail: {e}", flush=True)
            continue
        sdata = parse_next(sh)
        tabs = []
        if sdata:
            tabs = (sdata["props"]["pageProps"]["data"].get("menu") or [])
        # Prefer menu vods; fallback regex
        vods = []
        for tab in tabs:
            tp = tab.get("pageUrl") or ""
            if "credits" in tp or "specials" in tp:
                continue
            for v in tab.get("vods") or []:
                if v and v.get("pageUrl"):
                    vods.append(v)
        if not vods:
            for m in re.finditer(
                rf'href="(/{re.escape(spath)}/VOD-[A-Za-z0-9]+\.htm)"', sh, re.I
            ):
                vods.append({"pageUrl": m.group(1), "title": "", "extraInfo": ""})

        for i, v in enumerate(vods):
            if not v or not v.get("pageUrl"):
                continue
            full = "https://www.mako.co.il" + v["pageUrl"]
            if full in seen_pages:
                continue
            seen_pages.add(full)
            extra = v.get("extraInfo") or ""
            em = re.search(r"פרק\s*(\d+)", extra)
            ep_num = int(em.group(1)) if em else (i + 1)
            pic = ((v.get("pics") or [{}])[0] or {}).get("picUrl")
            vcm = v.get("itemVcmId") or v.get("galleryChannelId")
            ch = v.get("channelId")
            name = (v.get("title") or f"פרק {ep_num}").strip()
            stream = None
            subtitle = ""

            # Prefer episode page schema (more reliable than playlist under rate limits)
            try:
                ehtml = fetch(full, referer=surl).decode("utf-8", "ignore")
                time.sleep(DELAY)
                edata = parse_next(ehtml)
                if edata:
                    epage = edata["props"]["pageProps"]["data"]
                    schema = (epage.get("seo") or {}).get("schema") or {}
                    video = schema.get("video") or {}
                    stream = to_akamai(video.get("contentUrl"))
                    if schema.get("name"):
                        name = schema["name"].strip() or name
                    hero = epage.get("hero") or {}
                    subtitle = (hero.get("description") or schema.get("description") or "").strip()
                    if subtitle == name:
                        subtitle = ""
                    pic = schema.get("image") or video.get("thumbnailUrl") or pic
                    vod = epage.get("vod") or {}
                    vcm = vod.get("itemVcmId") or vod.get("galleryChannelId") or vcm
                    ch = vod.get("channelId") or ch
            except Exception as e:
                print(f"    ep page fail s{season}e{ep_num}: {e}", flush=True)

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
                    if media:
                        stream = to_akamai((ak[0] if ak else media[0])["url"])
                except Exception as e:
                    print(f"    playlist fail s{season}e{ep_num}: {e}", flush=True)

            ok = False
            if stream:
                try:
                    ok = ticket_ok(stream)
                    time.sleep(DELAY * 0.25)
                except Exception as e:
                    print(f"    ticket fail s{season}e{ep_num}: {e}", flush=True)

            img_rel = f"scripts/catalog/media/{slug}/s{season}-ep{ep_num}.jpg"
            local = save_image(pic, ROOT / img_rel)
            # Also mirror into app images path for optional packaging
            app_img = f"images/kanbox/{slug}/s{season}-ep{ep_num}.jpg"
            if local:
                try:
                    (ROOT / app_img).parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy(ROOT / local, ROOT / app_img)
                except Exception:
                    pass

            episodes.append(
                {
                    "ep": ep_num,
                    "season": season,
                    "name": name,
                    "subtitle": subtitle,
                    "pageURL": full,
                    "streamURL": stream,
                    "streamOk": ok,
                    "imageRemote": pic,
                    "localImage": app_img if local else None,
                    "catalogImage": local,
                }
            )
            print(f"  s{season}e{ep_num} ok={ok} {name}", flush=True)

    episodes.sort(key=lambda e: (e.get("season") or 1, e.get("ep") or 0))

    # Series poster
    poster = None
    hero_pics = ((page.get("hero") or {}).get("pics") or [])
    if hero_pics:
        poster = hero_pics[0].get("picUrl")
    catalog_poster = f"scripts/catalog/media/{slug}/series.jpg"
    app_poster = f"images/kanbox/{slug}/series.jpg"
    saved = save_image(poster, ROOT / catalog_poster)
    if saved:
        try:
            (ROOT / app_poster).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(ROOT / saved, ROOT / app_poster)
        except Exception:
            pass
    elif episodes and episodes[0].get("localImage"):
        try:
            shutil.copy(ROOT / episodes[0]["localImage"], ROOT / app_poster)
            shutil.copy(ROOT / episodes[0]["localImage"], ROOT / catalog_poster)
            saved = catalog_poster
        except Exception:
            pass

    version_src = json.dumps(
        [(e["season"], e["ep"], e.get("streamURL") or "") for e in episodes],
        ensure_ascii=False,
        separators=(",", ":"),
    )
    version = hashlib.sha1(version_src.encode("utf-8")).hexdigest()[:12]

    return {
        "slug": slug,
        "title": title,
        "source": "mako",
        "pageURL": page_url,
        "version": version,
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "episodeCount": len(episodes),
        "localPoster": app_poster,
        "catalogPoster": saved,
        "episodes": episodes,
    }


def write_manifest(packages: list[dict]) -> None:
    manifest = {
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "series": [
            {
                "slug": p["slug"],
                "title": p["title"],
                "source": p.get("source"),
                "version": p["version"],
                "episodeCount": p["episodeCount"],
                "updatedAt": p["updatedAt"],
            }
            for p in packages
        ],
    }
    (CATALOG / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def forward_to_node(argv: list[str]) -> int:
    """Delegate full Kan+Mako catalog refresh to the Node orchestrator."""
    script = ROOT / "scripts" / "catalog-updater.js"
    cmd = ["node", str(script), *argv]
    print("→", " ".join(cmd), flush=True)
    return subprocess.call(cmd, cwd=str(ROOT))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="Update only one slug from watchlist")
    ap.add_argument(
        "--mako-only",
        action="store_true",
        help="Only scrape Mako items (internal helper for Node orchestrator)",
    )
    ap.add_argument("--seed-only", action="store_true", help="Pass-through to Node")
    ap.add_argument("--source", help="Pass-through to Node (kan|mako)")
    ap.add_argument("--headed", action="store_true", help="Pass-through to Node")
    ap.add_argument("--headless", action="store_true", help="Pass-through to Node")
    args, unknown = ap.parse_known_args()

    # Default: full orchestrator (Kan + Mako)
    if not args.mako_only:
        forward_argv = []
        if args.slug:
            forward_argv += ["--slug", args.slug]
        if args.seed_only:
            forward_argv += ["--seed-only"]
        if args.source:
            forward_argv += ["--source", args.source]
        if args.headed:
            forward_argv += ["--headed"]
        if args.headless:
            forward_argv += ["--headless"]
        forward_argv += unknown
        raise SystemExit(forward_to_node(forward_argv))

    PACKAGES.mkdir(parents=True, exist_ok=True)
    MEDIA.mkdir(parents=True, exist_ok=True)
    if not WATCHLIST.exists():
        # Ensure watchlist exists before mako-only helper runs
        subprocess.check_call(
            ["node", str(ROOT / "scripts" / "catalog-updater.js"), "--seed-only"],
            cwd=str(ROOT),
        )
    watch = json.loads(WATCHLIST.read_text(encoding="utf-8"))
    items = [x for x in (watch.get("series") or []) if (x.get("source") or "mako") == "mako"]
    if args.slug:
        items = [x for x in items if x.get("slug") == args.slug]
        if not items:
            raise SystemExit(f"mako slug not in watchlist: {args.slug}")

    existing = {}
    for p in PACKAGES.glob("*.json"):
        try:
            existing[p.stem] = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            pass

    for item in items:
        pkg = scrape_mako_series(item)
        out = PACKAGES / f"{pkg['slug']}.json"
        out.write_text(json.dumps(pkg, ensure_ascii=False, indent=2), encoding="utf-8")
        (ROOT / "scripts" / f"mako-{pkg['slug']}.json").write_text(
            json.dumps(pkg, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        existing[pkg["slug"]] = pkg
        print(
            f"DONE {pkg['slug']}: {pkg['episodeCount']} eps version={pkg['version']}",
            flush=True,
        )

    packages = [existing[k] for k in sorted(existing.keys())]
    write_manifest(packages)
    print(f"Wrote {CATALOG / 'manifest.json'} ({len(packages)} series)", flush=True)


if __name__ == "__main__":
    main()
