#!/usr/bin/env python3
"""Merge scripts/svt-la-camilla-fran-gata-till-glamour-tur-och-retur.json into js/channels.js (Sweden tab)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "scripts" / "svt-la-camilla-fran-gata-till-glamour-tur-och-retur.json"
CHANNELS = ROOT / "js" / "channels.js"
SERIES_ID = "la-camilla-fran-gata-till-glamour-tur-och-retur"


def js_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def emit(data: dict) -> str:
    slug = data["slug"]
    lines = [
        "    {",
        f"        id: {js_str(slug)},",
        f"        name: {js_str(data.get('title') or 'La Camilla')},",
        f"        placeholder: {js_str(data.get('title') or 'La Camilla')},",
        f"        imageURL: {js_str(data['localPoster'])},",
        "        source: 'sweden',",
        "        defaultSubtitles: 'sv',",
        "        preferHlsJs: true,",
        f"        pageURL: {js_str(data.get('pageURL') or '')},",
        "        episodes: [",
    ]
    eps = data["episodes"]
    for i, ep in enumerate(eps):
        ep_id = f"{slug}-s{ep['season']}-ep{ep['ep']}"
        he_path = ROOT / "subs" / slug / f"s{ep['season']}-ep{ep['ep']}.he.vtt"
        use_he = he_path.exists() and he_path.stat().st_size > 500
        sub = (ep.get("subtitle") or ep.get("subtitle_he") or "").strip()
        lines += [
            "            {",
            f"                id: {js_str(ep_id)},",
            f"                season: {ep['season']},",
            f"                ep: {ep['ep']},",
            f"                name: {js_str(ep['name'])},",
        ]
        if sub:
            lines.append(f"                subtitle: {js_str(sub)},")
        lines += [
            f"                streamURL: {js_str(ep.get('streamURL') or '')},",
            f"                assetId: {js_str(ep['assetId'])},",
            "                streamResolve: 'svt',",
            f"                imageURL: {js_str(ep['localImage'])},",
            f"                placeholder: {js_str(str(ep['ep']))},",
        ]
        if use_he:
            he_rel = f"subs/{slug}/s{ep['season']}-ep{ep['ep']}.he.vtt"
            lines += [
                "                defaultSubtitles: 'he',",
                f"                subtitleURL: {js_str(he_rel)},",
            ]
        else:
            lines.append("                defaultSubtitles: 'sv',")
        lines += [
            "                preferHlsJs: true",
            "            }" + ("," if i < len(eps) - 1 else ""),
        ]
    lines += ["        ]", "    },"]
    return "\n".join(lines)


def remove_series(text: str, series_id: str) -> tuple[str, int]:
    needle = f"id: '{series_id}'"
    removed = 0
    while True:
        pos = text.find(needle)
        if pos < 0:
            break
        start = text.rfind("{", 0, pos)
        if start < 0:
            raise SystemExit(f"could not find object start for {series_id}")
        lead = start
        while lead > 0 and text[lead - 1] in " \t":
            lead -= 1
        if lead > 0 and text[lead - 1] == "\n":
            lead -= 1
        depth = 0
        i = start
        end = None
        while i < len(text):
            ch = text[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            i += 1
        if end is None:
            raise SystemExit(f"unbalanced braces for {series_id}")
        while end < len(text) and text[end] in " \t":
            end += 1
        if end < len(text) and text[end] == ",":
            end += 1
        text = text[:lead] + text[end:]
        removed += 1
    return text, removed


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    block = emit(data)
    text = CHANNELS.read_text(encoding="utf-8")
    text, n = remove_series(text, SERIES_ID)
    marker = "window.ISRTV_KANBOX = ["
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit("ISRTV_KANBOX marker not found")
    insert_at = idx + len(marker)
    text = text[:insert_at] + "\n" + block + text[insert_at:]
    CHANNELS.write_text(text, encoding="utf-8")
    print(f"merged {SERIES_ID}: removed={n}, episodes={len(data['episodes'])}")


if __name__ == "__main__":
    main()
