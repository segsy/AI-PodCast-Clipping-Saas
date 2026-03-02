from __future__ import annotations

from typing import Any, Dict, List
import re

EMOJI_MAP = [
    (r"\b(money|revenue|profit|paid)\b", "💰"),
    (r"\b(crazy|insane|wild)\b", "🤯"),
    (r"\b(secret|hidden)\b", "🤫"),
    (r"\b(time|minutes|seconds)\b", "⏱️"),
    (r"\b(win|winning|success)\b", "🏆"),
]


def inject_emojis(segments: List[Dict[str, Any]], min_gap_sec: float = 3.0) -> List[Dict[str, Any]]:
    last_emoji_t = -1e9
    out: List[Dict[str, Any]] = []

    for seg in segments:
        s = float(seg.get("start", 0.0))
        text = str(seg.get("text", "")).strip()
        if not text:
            out.append(seg)
            continue

        if (s - last_emoji_t) < min_gap_sec:
            out.append(seg)
            continue

        chosen = None
        for pattern, emoji in EMOJI_MAP:
            if re.search(pattern, text, flags=re.I):
                chosen = emoji
                break

        if chosen:
            next_seg = dict(seg)
            next_seg["text"] = f"{text} {chosen}"
            out.append(next_seg)
            last_emoji_t = s
        else:
            out.append(seg)

    return out
