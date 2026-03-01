from __future__ import annotations

from typing import Any, Dict, List
import re

BROLL_MAP = [
    (r"\b(website|landing page|homepage)\b", "assets/broll/browser_frame.png"),
    (r"\b(chart|growth|analytics)\b", "assets/broll/chart_pop.png"),
    (r"\b(phone|mobile)\b", "assets/broll/phone_frame.png"),
]


def choose_broll_overlays(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    overlays: List[Dict[str, Any]] = []
    used: set[str] = set()

    for seg in segments:
        text = str(seg.get("text", "")).lower()
        st = float(seg.get("start", 0.0))
        en = float(seg.get("end", st + 1.8))

        for pattern, path in BROLL_MAP:
            if path in used:
                continue
            if re.search(pattern, text, flags=re.I):
                overlays.append(
                    {
                        "path": path,
                        "start": st,
                        "end": min(en, st + 2.5),
                        "w": 720,
                        "h": 720,
                        "x": "(W-w)/2",
                        "y": "(H-h)/2",
                    }
                )
                used.add(path)

        if len(overlays) >= 2:
            break

    return overlays
