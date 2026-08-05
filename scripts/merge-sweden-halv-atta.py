#!/usr/bin/env python3
"""Merge scripts/tv4-halv-atta-hos-mig.json into js/channels.js (Sweden tab)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "scripts" / "tv4-halv-atta-hos-mig.json"
CHANNELS = ROOT / "js" / "channels.js"


def js_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def emit(data: dict) -> str:
    slug = data["slug"]
    lines = [
        "    {",
        f"        id: {js_str(slug)},",
        "        name: 'Halv åtta hos mig',",
        "        placeholder: 'Halv åtta hos mig',",
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
        lines += [
            "            {",
            f"                id: {js_str(ep_id)},",
            f"                season: {ep['season']},",
            f"                ep: {ep['ep']},",
            f"                name: {js_str(ep['name'])},",
            "                streamURL: '',",
            f"                assetId: {js_str(ep['assetId'])},",
            "                streamResolve: 'tv4',",
            f"                imageURL: {js_str(ep['localImage'])},",
            f"                placeholder: {js_str(str(ep['ep']))},",
            "                defaultSubtitles: 'sv',",
            "                preferHlsJs: true",
            "            }" + ("," if i < len(eps) - 1 else ""),
        ]
    lines += ["        ]", "    },"]
    return "\n".join(lines)


def remove_series(text: str, series_id: str) -> tuple[str, int]:
    """Remove top-level catalog object(s) with the given id via brace matching."""
    needle = f"id: '{series_id}'"
    removed = 0
    while True:
        pos = text.find(needle)
        if pos < 0:
            break
        # Walk back to the opening '{' of this object
        start = text.rfind("{", 0, pos)
        if start < 0:
            raise SystemExit(f"could not find object start for {series_id}")
        # Include leading comma/newline before the object when present
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
        # Drop trailing comma after the object
        while end < len(text) and text[end] in " \t":
            end += 1
        if end < len(text) and text[end] == ",":
            end += 1
        text = text[:lead] + text[end:]
        removed += 1
    return text, removed


def main() -> None:
    data = json.loads(JSON_PATH.read_text())
    block = emit(data)
    text = CHANNELS.read_text()
    text, n = remove_series(text, "halv-atta-hos-mig")
    marker = "window.ISRTV_KANBOX = [\n"
    if marker not in text:
        raise SystemExit("ISRTV_KANBOX marker missing")
    text = text.replace(marker, marker + block + "\n", 1)
    CHANNELS.write_text(text)
    print(f"merged halv-atta-hos-mig ({len(data['episodes'])} eps); removed old={n}")


if __name__ == "__main__":
    main()
