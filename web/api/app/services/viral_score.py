from __future__ import annotations

from dataclasses import dataclass

from ..subtitles import SubtitleSegment


@dataclass
class ViralScore:
    score: int
    reasons: list[str]
    improvements: list[str]


def rescore(
    original_score: int | None,
    hook_text: str,
    segments: list[SubtitleSegment],
    duration_sec: float,
    has_karaoke: bool,
    has_reframe: bool,
    has_broll: bool,
) -> ViralScore:
    score = original_score or 70
    reasons: list[str] = []

    hook_words = len(hook_text.split())
    if 6 <= hook_words <= 10:
        score += 6
        reasons.append("Hook length is within high-performing range (6-10 words).")

    if segments and segments[0].start <= 0.7:
        score += 4
        reasons.append("Speech starts quickly in first second.")

    subtitle_coverage = 0.0
    if duration_sec > 0 and segments:
        subtitle_coverage = sum(max(0.0, seg.end - seg.start) for seg in segments) / duration_sec
    if subtitle_coverage >= 0.9:
        score += 5
        reasons.append("Subtitle coverage is above 90%.")

    if has_karaoke:
        score += 4
        reasons.append("Karaoke timing increases retention and readability.")
    if has_reframe:
        score += 3
        reasons.append("Vertical reframing improves subject focus.")
    if has_broll:
        score += 2
        reasons.append("B-roll overlays add visual pattern interrupts.")

    score = max(0, min(100, score))

    improvements = [
        "Open with a sharper conflict or contrarian claim in first 1.5 seconds.",
        "Tighten pauses between subtitle lines to reduce dead air.",
    ]

    return ViralScore(score=score, reasons=reasons, improvements=improvements)
