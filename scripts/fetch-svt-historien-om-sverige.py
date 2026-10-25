#!/usr/bin/env python3
"""Fetch SVT Play Historien om Sverige into scripts/svt-historien-om-sverige.json (+ images / Swedish VTTs)."""
from __future__ import annotations

import json
import os
import re
import ssl
import subprocess
import time
import urllib.request
from pathlib import Path

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
ROOT = Path(__file__).resolve().parents[1]
SLUG = "historien-om-sverige"
OUT_JSON = ROOT / "scripts" / f"svt-{SLUG}.json"
DELAY = 0.25

# Keep existing Hebrew blurbs when refreshing catalog
HE_SUBTITLES = {}


def fetch(url: str, data: bytes | None = None, headers: dict | None = None) -> bytes:
    h = {"User-Agent": UA, "Accept": "*/*"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h, method="POST" if data else "GET")
    with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
        return r.read()


def gql(query: str, variables: dict | None = None) -> dict:
    body: dict = {"query": query}
    if variables is not None:
        body["variables"] = variables
    raw = fetch(
        "https://api.svt.se/contento/graphql",
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "client-name": "svtweb",
            "client-version": "2.0.0",
            "Accept": "application/json",
        },
    )
    return json.loads(raw.decode())


def abs_img(raw, width: str = "1200") -> str | None:
    if not raw:
        return None
    if isinstance(raw, dict):
        raw = raw.get("url") or raw.get("id") or ""
    raw = str(raw)
    if raw.startswith("http"):
        return raw
    m = re.match(r"^(\d+)", raw)
    if not m:
        return None
    return f"https://www.svtstatic.se/image/wide/{width}/{m.group(1)}"


def compress_jpeg(path: Path) -> None:
    try:
        subprocess.run(
            [
                "sips",
                "-Z",
                "720",
                "-s",
                "format",
                "jpeg",
                "-s",
                "formatOptions",
                "70",
                str(path),
                "--out",
                str(path),
            ],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception:
        pass


def save_bytes(url: str | None, dest_rel: str, force: bool = False) -> str | None:
    if not url:
        return None
    dest = ROOT / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not force and dest.exists() and dest.stat().st_size > 1000:
        return dest_rel
    try:
        dest.write_bytes(fetch(url))
        if dest.suffix.lower() in (".jpg", ".jpeg"):
            compress_jpeg(dest)
        time.sleep(DELAY * 0.4)
        return dest_rel
    except Exception as e:
        print(f"    save fail {dest_rel}: {e}")
        return None


def parse_vtt(text: str) -> list[dict]:
    cues = []
    blocks = re.split(r"\n\s*\n", text.replace("\r\n", "\n").replace("\r", "\n").strip())
    i = 0
    for block in blocks:
        lines = [ln for ln in block.split("\n") if ln.strip() != ""]
        if not lines:
            continue
        if lines[0].startswith(("WEBVTT", "STYLE", "NOTE", "::cue")):
            continue
        timing_idx = None
        for idx, ln in enumerate(lines):
            if "-->" in ln:
                timing_idx = idx
                break
        if timing_idx is None:
            continue
        m = re.match(r"([\d:.]+)\s*-->\s*([\d:.]+)", lines[timing_idx])
        if not m:
            continue
        body = "\n".join(lines[timing_idx + 1 :])
        body = re.sub(r"</?c[^>]*>", "", body)
        body = re.sub(r"<[^>]+>", "", body).strip()
        if not body:
            continue
        cues.append({"i": i, "start": m.group(1), "end": m.group(2), "text": body})
        i += 1
    return cues


def pick_hls(vinfo: dict) -> str | None:
    refs = vinfo.get("videoReferences") or []
    for pref in ("hls-cmaf-full", "hls-cmaf-avc", "hls"):
        for r in refs:
            if r.get("format") == pref and r.get("url"):
                return r["url"]
    for r in refs:
        if "m3u8" in (r.get("url") or ""):
            return r["url"]
    return None


def pick_sub(vinfo: dict) -> str | None:
    for sr in vinfo.get("subtitleReferences") or []:
        u = sr.get("url") or ""
        if "text-closed" in u:
            return u
    for sr in vinfo.get("subtitleReferences") or []:
        if sr.get("format") == "webvtt" and (sr.get("url") or "").endswith(".vtt"):
            return sr["url"]
    return None


def main() -> None:
    print("==== historien-om-sverige (SVT)")
    prev = {}
    if OUT_JSON.exists():
        try:
            prev = {e["ep"]: e for e in json.loads(OUT_JSON.read_text(encoding="utf-8")).get("episodes", [])}
        except Exception:
            prev = {}

    res = gql(
        """
        query($slugs:[String!]!) {
          listablesBySlug(slugs:$slugs) {
            ... on TvSeries {
              name
              slug
              shortDescription
              longDescription
              image { id url(width: W1200) }
              associatedContent(include:[season, productionPeriod]) {
                id
                name
                type
                items {
                  item {
                    __typename
                    ... on Episode {
                      id
                      svtId
                      name
                      slug
                      videoSvtId
                      number
                      positionInSeason
                      shortDescription
                      longDescription
                      duration
                      validFrom
                      validTo
                      image { id url(width: W800) }
                      urls { svtplay }
                    }
                  }
                }
              }
            }
          }
        }
        """,
        {"slugs": [SLUG]},
    )
    series = ((res.get("data") or {}).get("listablesBySlug") or [None])[0]
    if not series:
        raise SystemExit(res)
    title = series.get("name") or "Historien om Sverige"
    poster = f"images/kanbox/{SLUG}/series.jpg"
    save_bytes(abs_img(series.get("image"), "1200"), poster, force=True)

    episodes: list[dict] = []
    for season in series.get("associatedContent") or []:
        for it in season.get("items") or []:
            ep = it.get("item") or {}
            if ep.get("__typename") != "Episode":
                continue
            vid = ep.get("videoSvtId")
            if not vid:
                continue
            num = int(ep.get("number") or ep.get("positionInSeason") or 0)
            print(f"  ep{num} {vid}")
            vinfo = json.loads(fetch(f"https://api.svt.se/video/{vid}").decode())
            hls = pick_hls(vinfo)
            sub_url = pick_sub(vinfo)
            local = f"images/kanbox/{SLUG}/s1-ep{num}.jpg"
            save_bytes(abs_img(ep.get("image"), "800") or vinfo.get("firstFrame"), local, force=True)
            page = ((ep.get("urls") or {}).get("svtplay") or f"https://www.svtplay.se/video/{vid}/{SLUG}/avsnitt-{num}")
            if page.startswith("/"):
                page = "https://www.svtplay.se" + page
            row = {
                "ep": num,
                "season": 1,
                "name": (ep.get('name') or f'פרק {num}').strip(),
                "subtitle_sv": (ep.get("longDescription") or ep.get("shortDescription") or "").strip(),
                "subtitle": HE_SUBTITLES.get(num) or (prev.get(num) or {}).get("subtitle") or "",
                "pageURL": page,
                "assetId": vid,
                "svtId": ep.get("svtId"),
                "streamResolve": "svt",
                "streamURL": hls or "",
                "localImage": local,
                "subtitleRemote": sub_url,
                "duration": ep.get("duration") or vinfo.get("contentDuration"),
                "validFrom": ep.get("validFrom") or (vinfo.get("rights") or {}).get("validFrom"),
                "defaultSubtitles": "sv",
                "preferHlsJs": True,
            }
            if sub_url:
                tag = f"s1-ep{num}"
                dest = f"scripts/subs/{SLUG}/{tag}.sv.vtt"
                if save_bytes(sub_url, dest, force=True):
                    cues = parse_vtt((ROOT / dest).read_text(encoding="utf-8"))
                    (ROOT / "scripts/subs" / SLUG / f"{tag}.cues.json").write_text(
                        json.dumps(cues, ensure_ascii=False, indent=2), encoding="utf-8"
                    )
                    print(f"    cues={len(cues)}")
            episodes.append(row)
            time.sleep(DELAY)

    episodes = sorted(episodes, key=lambda e: e["ep"])
    out = {
        "slug": SLUG,
        "title": title,
        "source": "sweden",
        "pageURL": f"https://www.svtplay.se/{SLUG}",
        "localPoster": poster,
        "shortDescription": series.get("shortDescription") or "",
        "longDescription": series.get("longDescription") or "",
        "shortDescriptionHe": "מהתקופה הקרחונית ועד ימינו",
        "longDescriptionHe": "הסיפור הגדול על ארצנו — מהתקופה הקרחונית ועד ימינו.",
        "defaultSubtitles": "sv",
        "preferHlsJs": True,
        "episodes": episodes,
    }
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"DONE {len(episodes)} episodes → {OUT_JSON}")


if __name__ == "__main__":
    main()
