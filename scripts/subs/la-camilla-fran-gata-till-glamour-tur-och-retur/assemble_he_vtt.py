#!/usr/bin/env python3
"""Assemble Hebrew VTT from translations JSON. Usage: assemble_he_vtt.py s1-epN"""
import json, re, sys
from pathlib import Path

ROOT = Path("/Users/evyatardayan/workspace/ISRTV")
D = ROOT / "scripts/subs/la-camilla-fran-gata-till-glamour-tur-och-retur"


def load_glossary_apply():
    gpath = D / "name_place_glossary.json"
    if not gpath.exists():
        return lambda t: t
    g = json.loads(gpath.read_text(encoding="utf-8"))
    repl = {**(g.get("people") or {}), **(g.get("places") or {})}
    keepers = sorted(g.get("keep_latin") or [], key=len, reverse=True)
    keys = sorted(repl.keys(), key=len, reverse=True)

    def apply(text: str) -> str:
        out = text
        for i, k in enumerate(keepers):
            out = out.replace(k, f"\x00K{i}\x00")
        for k in keys:
            out = re.sub(
                rf"(?<![A-Za-zÅÄÖåäöÉéÜü]){re.escape(k)}(?![A-Za-zÅÄÖåäöÉéÜü])",
                repl[k],
                out,
            )
        for i, k in enumerate(keepers):
            out = out.replace(f"\x00K{i}\x00", k)
        out = re.sub(r"([לבמוושכה])-([\u0590-\u05FF])", r"\1\2", out)
        return out

    return apply


def normalize_text(text: str) -> str:
    lines = []
    for line in text.split("\n"):
        line = line.lstrip("\u200f").strip()
        m = re.match(r"^((?:\.{2,}|…|[?!]+))(\s*)(.+)$", line, flags=re.S)
        if m:
            line = m.group(3).rstrip() + m.group(1)
        lines.append(line)
    return "\n".join(lines)


def main(tag: str):
    apply_glossary = load_glossary_apply()
    cues = json.loads((D / f"{tag}.cues.json").read_text(encoding="utf-8"))
    tr = json.loads((D / f"{tag}.he.translations.json").read_text(encoding="utf-8"))
    assert len(tr) == len(cues), (len(tr), len(cues))
    out = []
    for a, b in zip(cues, tr):
        assert a["i"] == b["i"] and a["start"] == b["start"] and a["end"] == b["end"]
        text = normalize_text(apply_glossary(b["text"]))
        out.append({"i": a["i"], "start": a["start"], "end": a["end"], "text": text})
    (D / f"{tag}.he.translations.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = ["WEBVTT", ""]
    for i, c in enumerate(out):
        lines += [str(i + 1), f"{c['start']} --> {c['end']}", c["text"], ""]
    vtt = "\n".join(lines) + "\n"
    for p in (ROOT / "subs/la-camilla-fran-gata-till-glamour-tur-och-retur" / f"{tag}.he.vtt", D / f"{tag}.he.vtt"):
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(vtt, encoding="utf-8")
    bad = sum(
        1
        for c in out
        for line in c["text"].split("\n")
        if re.match(r"^(?:\.{2,}|…|[?!])", line)
    )
    print(f"ok {tag} cues={len(out)} leading_punct={bad}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: assemble_he_vtt.py s1-epN")
    main(sys.argv[1])
