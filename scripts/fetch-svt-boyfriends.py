#!/usr/bin/env python3
"""Fetch SVT Play Boyfriends into scripts/svt-boyfriends.json (+ images / Swedish VTTs)."""
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
SLUG = "boyfriends"
OUT_JSON = ROOT / "scripts" / f"svt-{SLUG}.json"
DELAY = 0.25

# Keep existing Hebrew blurbs when refreshing catalog
HE_SUBTITLES = {
    1: "אדווין תורנבלום, אוסקר זיה וסבסטיאן המרברג נוסעים לאורה לחגוג את השנה החדשה. אבל אווירת החגיגה מתפוררת מהר כשמתברר שיש דברים בחבורה שצורמים ואולי צריכים לעלות אל פני השטח. כי מה קורה לחברות כשלפתע יש אפשרות מינית? חלק 1 מתוך 8.",
    2: "האווירה באורה רחוקה מלהיות רגועה אחרי חגיגת השנה החדשה שהשתבשה אתמול. האם החברות של החבורה בסכנה? בחזרה בסטוקהולם, אדווין העצבני אמור להנחות את גאלת QX, בזמן שאוסקר מתלבט אם בכלל להגיע. וכמו תמיד, סבסטיאן נתקע באמצע. בנוסף, אוסקר חושף צד מכוער של עצמו. חלק 2 מתוך 8.",
    3: "אוסקר מספר לאדווין שהוא לא יכול להגיע למסיבת ה-30 שלו. במקביל אדווין מתכונן להופעת הסולו שלו ומפחד שהלחץ שהוא שם על עצמו יגרום לו לקרוס. לאוסקר יש בכורה של המיוזיקל, ואדווין וסבסטיאן הולכים על גדול כשהם קונים פרחי בכורה. כשאדווין מספר שהוא סירב להיות דובר קיץ וחושף על מה התוכנית הייתה אמורה לעסוק, סבסטיאן בהלם וחושב שזה היה בדיוק ההחלטה הנכונה. חלק 3 מתוך 8.",
    4: "סוף סוף מגיעה מסיבת ה-30 הגדולה — הידועה גם כחתונה של אדווין. אוסקר מספר איך הוא יפצה על כך שהוא מפספס את הארוחה — אבל האם הוא לקח על עצמו יותר מדי? סבסטיאן נפתח על פרידה שהשאירה בו צלקות עמוקות, ואדווין חושף למה הוא לא שכב שש שנים. חלק 4 מתוך 8.",
    5: "אוסקר וסבסטיאן נוסעים לנורשפינג לראות את הופעת הסולו החדשה של אדווין. אדווין העצבני חושף שהוא הולך לקרוא בהופעה מכתב רגשי לאוסקר. השאלה היא רק איך אוסקר, שלא יודע על זה, יקבל את זה. סבסטיאן לא חושב שהוא מוכן למה שבדרך. חלק 5 מתוך 8.",
    6: "אחרי מכתב האהבה של אדווין בנורשפינג, אוסקר מתמודד עם רגשות קשים. במקביל נראה שאדווין כבר התקדם ומתכונן לדייט כפול עם סבסטיאן. בגאלת ELLE סבסטיאן סוף סוף זורח, אבל הקור בין אוסקר לאדווין מטיל צל על הערב. אוסקר מרגיש יותר ויותר מחוץ לחבורת ההומואים. האם החברות בורחת לו מהידיים? חלק 6 מתוך 8.",
    7: "אוסקר מרגיש מחוץ לחבורת ההומואים ולוקח את העניינים לידיים — הוא מזמין בקתה לחבר'ה. אדווין מראה בפעם הראשונה את הדירה החדשה שלו, וסבסטיאן נאבק עם העצבים לפני הפודקאסט החי — האם יצליח למכור את כל הכרטיסים? בסוף שלושתם נפגשים בבקתה מחוץ לסטוקהולם, שם אוסקר מתלבט עם שאלה שהוא כבר מזמן רוצה לשאול את אדווין. אבל האם הוא מעז להעלות את מה שצורם ביניהם? חלק 7 מתוך 8.",
    8: "סיום העונה — האם החברות של חבורת ההומואים תחזיק? בבקתה מחוץ לסטוקהולם אוסקר סוף סוף מעז לשאול את אדווין איפה הם באמת עומדים זה עם זה. בחזרה בסטוקהולם לסבסטיאן יש פודקאסט חי, ואדווין אוסף את כולם לארוחת רוזה, אבל האווירה מתקשה כשמדברים על האלבום החדש של אוסקר. על מי בעצם השירים? חלק 8 מתוך 8.",
}


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
    print("==== boyfriends (SVT)")
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
    title = series.get("name") or "Boyfriends"
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
                "name": f"פרק {num}",
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
        "shortDescriptionHe": "סדרת ריאליטי על חברות, אהבה וגבולות",
        "longDescriptionHe": "אדווין תורנבלום, אוסקר זיה וסבסטיאן המרברג מנסים לנווט במה שזה אומר להיות בפעם הראשונה חלק מחבורת הומואים אמיתית.",
        "defaultSubtitles": "sv",
        "preferHlsJs": True,
        "episodes": episodes,
    }
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"DONE {len(episodes)} episodes → {OUT_JSON}")


if __name__ == "__main__":
    main()
