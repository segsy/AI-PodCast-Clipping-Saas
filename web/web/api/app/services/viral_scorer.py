from __future__ import annotations

from typing import Any, Dict, List
import re


def rule_score(segments: List[Dict[str, Any]], hook: str) -> int:
    score = 50

    hook_words = [w for w in hook.split(" ") if w.strip()]
    if 6 <= len(hook_words) <= 10:
        score += 10
    if re.search(r"\?$", hook) or re.search(r"\b(why|how|what)\b", hook.lower()):
        score += 8
    if re.search(r"\b(secret|nobody|never|mistake|fail|stop)\b", hook.lower()):
        score += 8

    if segments:
        speak = sum(max(0.0, float(s.get("end", 0.0)) - float(s.get("start", 0.0))) for s in segments)
        clip_len = float(segments[-1].get("end", 0.0)) - float(segments[0].get("start", 0.0))
        if clip_len > 0:
            coverage = speak / clip_len
            if coverage > 0.90:
                score += 8
            elif coverage > 0.75:
                score += 4

    return max(0, min(100, score))


def rescore_viral(segments: List[Dict[str, Any]], hook: str) -> Dict[str, Any]:
    score = rule_score(segments, hook)
    improvements: list[str] = []
    if score < 70:
        improvements.append("Shorten pauses in the first 2 seconds.")
        improvements.append("Use a stronger curiosity hook (question or contradiction).")
    return {"viral_score": score, "improvements": improvements}
