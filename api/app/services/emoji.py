from __future__ import annotations

from ..subtitles import SubtitleSegment
from .emoji_injector import inject_emojis as inject_emojis_dict


def inject_emojis(segments: list[SubtitleSegment], min_spacing_sec: float = 3.0) -> list[SubtitleSegment]:
    rows = [{"start": seg.start, "end": seg.end, "text": seg.text} for seg in segments]
    injected = inject_emojis_dict(rows, min_gap_sec=min_spacing_sec)
    return [SubtitleSegment(start=float(row["start"]), end=float(row["end"]), text=str(row["text"])) for row in injected]
