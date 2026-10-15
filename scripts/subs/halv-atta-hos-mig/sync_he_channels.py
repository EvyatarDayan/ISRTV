#!/usr/bin/env python3
"""Wire Hebrew subtitleURL for any s26/s27 episodes that have a valid .he.vtt."""
import json, re
from pathlib import Path

ROOT = Path("/Users/evyatardayan/workspace/ISRTV")
S = ROOT / "subs" / "halv-atta-hos-mig"
D = ROOT / "scripts" / "subs" / "halv-atta-hos-mig"
CHANNELS = ROOT / "js" / "channels.js"


def ready_tags():
    out = []
    for p in sorted(S.glob("s2*-ep*.he.vtt")):
        m = re.match(r"(s2[67]-ep(\d+))\.he\.vtt", p.name)
        if not m:
            continue
        tag = m.group(1)
        cues_path = D / f"{tag}.cues.json"
        if not cues_path.exists():
            continue
        cues = json.loads(cues_path.read_text(encoding="utf-8"))
        if p.read_text(encoding="utf-8").count("-->") == len(cues):
            out.append(tag)
    return out


def main():
    ready = set(ready_tags())
    text = CHANNELS.read_text(encoding="utf-8")

    def patch(m):
        season, ep = m.group(1), m.group(2)
        tag = f"s{season}-ep{ep}"
        block = m.group(0)
        if tag in ready:
            block = re.sub(
                r"defaultSubtitles:\s*'[^']*',\n(?:\s*subtitleURL:\s*'[^']*',\n)?",
                f"defaultSubtitles: 'he',\n                subtitleURL: 'subs/halv-atta-hos-mig/{tag}.he.vtt',\n",
                block,
                count=1,
            )
        else:
            block = re.sub(
                r"defaultSubtitles:\s*'he',\n\s*subtitleURL:\s*'[^']*',\n",
                "defaultSubtitles: 'sv',\n",
                block,
            )
        return block

    new, n = re.subn(
        r"id:\s*'halv-atta-hos-mig-s(2[67])-ep(\d+)',[\s\S]*?preferHlsJs:\s*true",
        patch,
        text,
    )
    CHANNELS.write_text(new, encoding="utf-8")
    he = sorted(
        re.findall(r"subtitleURL: 'subs/halv-atta-hos-mig/(s2[67]-ep\d+)\.he\.vtt'", new)
    )
    print("patched blocks", n)
    print("hebrew wired", len(he))
    print("s27", [x for x in he if x.startswith("s27")])


if __name__ == "__main__":
    main()
