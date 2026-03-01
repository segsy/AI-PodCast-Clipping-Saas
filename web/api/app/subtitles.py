from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


@dataclass
class SubtitleSegment:
    start: float
    end: float
    text: str


def slice_transcript(transcript: Iterable[dict], start: float, end: float) -> list[SubtitleSegment]:
    sliced: list[SubtitleSegment] = []

    for segment in transcript:
        seg_start = float(segment.get("start", 0.0))
        seg_end = float(segment.get("end", 0.0))
        seg_text = str(segment.get("text", "")).strip()

        if not seg_text:
            continue
        if seg_end <= start or seg_start >= end:
            continue

        new_start = max(seg_start, start) - start
        new_end = min(seg_end, end) - start

        if new_end <= new_start:
            continue

        sliced.append(SubtitleSegment(start=new_start, end=new_end, text=seg_text))

    return sliced


def format_timestamp(seconds: float) -> str:
    safe_seconds = max(0.0, seconds)
    whole = int(safe_seconds)
    millis = int((safe_seconds - whole) * 1000)

    hours = whole // 3600
    minutes = (whole % 3600) // 60
    secs = whole % 60

    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def generate_srt(segments: Iterable[SubtitleSegment], path: Path) -> None:
    lines: list[str] = []

    for idx, seg in enumerate(segments, start=1):
        lines.extend(
            [
                str(idx),
                f"{format_timestamp(seg.start)} --> {format_timestamp(seg.end)}",
                seg.text,
                "",
            ]
        )

    path.write_text("\n".join(lines), encoding="utf-8")
