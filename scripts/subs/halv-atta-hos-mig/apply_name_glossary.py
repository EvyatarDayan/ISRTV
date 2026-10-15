#!/usr/bin/env python3
"""Apply name_place_glossary.json to all s26 HE VTTs + translations JSON."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
D = Path(__file__).resolve().parent
S = ROOT / "subs" / "halv-atta-hos-mig"

def main():
    g = json.loads((D / "name_place_glossary.json").read_text(encoding="utf-8"))
    repl = {**g["people"], **g["places"]}
    keepers = sorted(g.get("keep_latin") or [], key=len, reverse=True)
    keys = sorted(repl.keys(), key=len, reverse=True)

    def apply_text(text: str) -> str:
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

    for vtt in sorted(list(S.glob("s26-ep*.he.vtt")) + list(S.glob("s27-ep*.he.vtt"))):
        tag = vtt.name.replace(".he.vtt", "")
        new = apply_text(vtt.read_text(encoding="utf-8"))
        vtt.write_text(new, encoding="utf-8")
        (D / vtt.name).write_text(new, encoding="utf-8")
        jp = D / f"{tag}.he.translations.json"
        if jp.exists():
            arr = json.loads(jp.read_text(encoding="utf-8"))
            for item in arr:
                item["text"] = apply_text(item["text"])
            jp.write_text(json.dumps(arr, ensure_ascii=False, indent=2), encoding="utf-8")
        print("ok", tag)

if __name__ == "__main__":
    main()
