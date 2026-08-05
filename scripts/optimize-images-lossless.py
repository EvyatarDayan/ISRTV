#!/usr/bin/env python3
"""Optimize ISRTV images without lowering display resolution or dropping artwork.

1) Re-encode JPEGs at the same pixel size with high-quality optimized encoding
   (only replace when the new file is meaningfully smaller).
2) Lossless-optimize PNGs.
3) Hard-link exact duplicate files (every filename stays; saves disk space).

Does not delete unique images or downscale.
"""
from __future__ import annotations

import hashlib
import io
import os
from collections import defaultdict
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
# High quality — visually equivalent for photo thumbnails on TV
JPEG_QUALITY = 92
MIN_SAVE_RATIO = 0.92  # replace only if new <= 92% of old


def optimize_jpeg(path: Path) -> int:
    raw = path.read_bytes()
    before = len(raw)
    try:
        im = Image.open(io.BytesIO(raw))
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        out = buf.getvalue()
        if len(out) <= int(before * MIN_SAVE_RATIO) and len(out) > 0:
            path.write_bytes(out)
            return before - len(out)
    except Exception:
        return 0
    return 0


def optimize_png(path: Path) -> int:
    raw = path.read_bytes()
    before = len(raw)
    try:
        im = Image.open(io.BytesIO(raw))
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        out = buf.getvalue()
        if 0 < len(out) < before:
            path.write_bytes(out)
            return before - len(out)
    except Exception:
        return 0
    return 0


def hardlink_duplicates() -> tuple[int, int]:
    by_hash: dict[str, list[Path]] = defaultdict(list)
    for path in IMAGES.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png"}:
            by_hash[hashlib.md5(path.read_bytes()).hexdigest()].append(path)
    linked = freed = 0
    for paths in by_hash.values():
        if len(paths) < 2:
            continue
        paths = sorted(paths, key=lambda p: str(p))
        keep = paths[0]
        for extra in paths[1:]:
            try:
                if os.path.samefile(keep, extra):
                    continue
            except OSError:
                pass
            freed += extra.stat().st_size
            extra.unlink()
            os.link(keep, extra)
            linked += 1
    return linked, freed


def main() -> None:
    before = sum(p.stat().st_size for p in IMAGES.rglob("*") if p.is_file())
    saved = n_jpg = n_png = 0
    for path in sorted(IMAGES.rglob("*")):
        if not path.is_file():
            continue
        suf = path.suffix.lower()
        if suf in {".jpg", ".jpeg"}:
            got = optimize_jpeg(path)
            if got:
                n_jpg += 1
                saved += got
        elif suf == ".png":
            got = optimize_png(path)
            if got:
                n_png += 1
                saved += got
    linked, freed = hardlink_duplicates()
    # du-like apparent size (hardlinks counted once) approx via unique inodes
    seen = set()
    unique = 0
    for p in IMAGES.rglob("*"):
        if not p.is_file():
            continue
        st = p.stat()
        key = (st.st_dev, st.st_ino)
        if key in seen:
            continue
        seen.add(key)
        unique += st.st_size
    print(f"re-encoded {n_jpg} JPEGs + {n_png} PNGs, encoding save {saved/1024/1024:.1f} MB")
    print(f"hard-linked {linked} exact duplicates (filenames kept)")
    print(f"images logical unique {unique/1024/1024:.1f} MB "
          f"(was {before/1024/1024:.1f} MB file-sum before)")


if __name__ == "__main__":
    main()
