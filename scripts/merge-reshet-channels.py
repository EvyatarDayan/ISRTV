#!/usr/bin/env python3
"""Merge scripts/reshet-*.json into js/channels.js (source: reshet)."""
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CHANNELS = os.path.join(ROOT, "js", "channels.js")

ORDER = [
    "power-couple",
    "haaretz-hamuvtachat",
    "asenheim",
    "haramon",
    "ha-maabara",
    "wart",
    "shnot-ha-80",
    "blackspace",
    "ehad-haam-1",
    "ehad-haam-101",
    "zot-vezoti",
    "yaniv",
    "litzvi-yesh-beaya",
    "amammiot",
    "haisraelim",
    "hamitnachel",
    "lo-lifnei-hayeladim",
    "haerev-etzel-ben",
    "magen-david-darom",
    "patrick",
    "shnot-ha-90",
    "nevsu",
    "televizya-mehaatid",
    "leehov-et-ana",
]


def esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace("'", "\\'")


def to_entry(data: dict) -> str:
    slug = data["slug"]
    title = data.get("title") or slug
    poster = data.get("localPoster") or f"images/kanbox/{slug}/series.jpg"
    eps = sorted(
        data.get("episodes") or [],
        key=lambda e: (e.get("season") or 1, e.get("ep") or 0),
    )
    multi = len({e.get("season") or 1 for e in eps}) > 1
    lines = [
        "    {",
        f"        id: '{slug}',",
        f"        name: '{esc(title)}',",
        f"        placeholder: '{esc(title)}',",
        f"        imageURL: '{poster}',",
        "        source: 'reshet',",
        "        episodes: [",
    ]
    for i, e in enumerate(eps):
        season = e.get("season") or 1
        ep = e.get("ep") or (i + 1)
        eid = f"{slug}-s{season}-ep{ep}" if multi else f"{slug}-ep{ep}"
        img = e.get("localImage") or (
            f"images/kanbox/{slug}/s{season}-ep{ep}.jpg"
            if multi
            else f"images/kanbox/{slug}/s1-ep{ep}.jpg"
        )
        subtitle = (e.get("subtitle") or "").strip()
        ep_title = e.get("name") or f"פרק {ep}"
        if re.match(r"^עונה\s+\d+\s+פרק\s+\d+", ep_title):
            name = ep_title
        elif re.match(r"^הרמון,", ep_title) or "פרק" in ep_title:
            name = ep_title
        else:
            name = f"עונה {season} פרק {ep} — {ep_title}"
        asset_id = e.get("assetId") or ""
        comma = "," if i < len(eps) - 1 else ""
        lines += [
            "            {",
            f"                id: '{eid}',",
            f"                season: {season},",
            f"                ep: {ep},",
            f"                name: '{esc(name)}',",
            *([f"                subtitle: '{esc(subtitle)}',"] if subtitle else []),
            "                streamURL: '',",
            f"                assetId: '{asset_id}',",
            "                streamResolve: 'reshet',",
            f"                imageURL: '{img}',",
            f"                placeholder: '{ep}'",
            "            }" + comma,
        ]
    lines += ["        ]", "    }"]
    return "\n".join(lines)


def find_kanbox_array_bounds(src: str):
    marker = "window.ISRTV_KANBOX = ["
    start = src.index(marker) + len(marker)
    i = start
    depth = 1
    in_str = False
    str_ch = ""
    escape = False
    while i < len(src):
        c = src[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == str_ch:
                in_str = False
        else:
            if c in ("'", '"', "`"):
                in_str = True
                str_ch = c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return start, i
        i += 1
    raise RuntimeError("KANBOX array end not found")


def strip_reshet_entries(array_body: str) -> str:
    out = []
    i = 0
    n = len(array_body)
    while i < n:
        while i < n and array_body[i] in " \t\r\n,":
            i += 1
        if i >= n:
            break
        if array_body[i] != "{":
            out.append(array_body[i:])
            break
        start = i
        depth = 0
        in_str = False
        str_ch = ""
        escape = False
        while i < n:
            c = array_body[i]
            if in_str:
                if escape:
                    escape = False
                elif c == "\\":
                    escape = True
                elif c == str_ch:
                    in_str = False
            else:
                if c in ("'", '"', "`"):
                    in_str = True
                    str_ch = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        i += 1
                        block = array_body[start:i]
                        if "source: 'reshet'" not in block and 'source: "reshet"' not in block:
                            out.append(block)
                        break
            i += 1
    return ",\n".join(out)


def main():
    entries = []
    for slug in ORDER:
        path = os.path.join(ROOT, "scripts", f"reshet-{slug}.json")
        if not os.path.exists(path):
            print("missing", slug)
            continue
        data = json.load(open(path, encoding="utf-8"))
        data["slug"] = slug
        eps = data.get("episodes") or []
        print(f"{slug}: {len(eps)} episodes, title={data.get('title')}")
        if not eps:
            continue
        entries.append(to_entry(data))

    if not entries:
        raise SystemExit("nothing to merge")

    src = open(CHANNELS, encoding="utf-8").read()
    a0, a1 = find_kanbox_array_bounds(src)
    body = src[a0:a1]
    kept = strip_reshet_entries(body).strip()
    reshet_block = ",\n".join(entries)
    if kept:
        new_body = "\n" + reshet_block + ",\n" + kept + "\n"
    else:
        new_body = "\n" + reshet_block + "\n"
    open(CHANNELS, "w", encoding="utf-8").write(src[:a0] + new_body + src[a1:])
    print(f"merged {len(entries)} reshet series into channels.js")


if __name__ == "__main__":
    main()
