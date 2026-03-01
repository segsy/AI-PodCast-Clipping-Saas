from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional
import re

from ..subtitles import SubtitleSegment


def _ass_escape(text: str) -> str:
    text = text.replace("\\", r"\\")
    text = text.replace("{", r"\{").replace("}", r"\}")
    text = text.replace("\n", r"\N")
    return text


def _sec_to_ass_ts(sec: float) -> str:
    if sec < 0:
        sec = 0.0
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = sec % 60
    cs = int(round((s - int(s)) * 100))
    return f"{h:d}:{m:02d}:{int(s):02d}.{cs:02d}"


def _normalize_text_spacing(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


@dataclass
class AssStyle:
    font_name: str = "Inter"
    font_size: int = 66
    primary_color: str = "&H00FFFFFF"
    outline_color: str = "&H00000000"
    back_color: str = "&H80000000"
    bold: int = 1
    outline: int = 8
    shadow: int = 2
    alignment: int = 2
    margin_l: int = 80
    margin_r: int = 80
    margin_v: int = 220


PRESET_STYLES: dict[str, AssStyle] = {
    "tiktok_fast": AssStyle(font_name="Inter", font_size=68, outline=9, margin_v=230),
    "reels_clean": AssStyle(font_name="Inter", font_size=62, outline=7, margin_v=210),
    "shorts_bold": AssStyle(font_name="Arial", font_size=70, outline=10, margin_v=235),
}


def build_ass_header(play_res_x: int, play_res_y: int, style: AssStyle, include_alt_style: bool = True) -> str:
    lines: list[str] = []
    lines.append("[Script Info]")
    lines.append("ScriptType: v4.00+")
    lines.append("Collisions: Normal")
    lines.append(f"PlayResX: {play_res_x}")
    lines.append(f"PlayResY: {play_res_y}")
    lines.append("WrapStyle: 2")
    lines.append("ScaledBorderAndShadow: yes")
    lines.append("")
    lines.append("[V4+ Styles]")
    lines.append(
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
        "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
        "Alignment, MarginL, MarginR, MarginV, Encoding"
    )
    lines.append(
        f"Style: CAPTION,{style.font_name},{style.font_size},{style.primary_color},&H000000FF,"
        f"{style.outline_color},{style.back_color},{style.bold},0,0,0,100,100,0,0,1,"
        f"{style.outline},{style.shadow},{style.alignment},{style.margin_l},{style.margin_r},{style.margin_v},1"
    )

    if include_alt_style:
        lines.append(
            f"Style: EMPH,{style.font_name},{style.font_size + 6},{style.primary_color},&H000000FF,"
            f"{style.outline_color},{style.back_color},{style.bold},0,0,0,100,100,0,0,1,"
            f"{style.outline + 1},{style.shadow + 1},{style.alignment},{style.margin_l},{style.margin_r},{style.margin_v},1"
        )

    lines.append("")
    lines.append("[Events]")
    lines.append("Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text")
    return "\n".join(lines) + "\n"


def _dialogue(start: float, end: float, text: str, style_name: str = "CAPTION", layer: int = 0) -> str:
    return f"Dialogue: {layer},{_sec_to_ass_ts(start)},{_sec_to_ass_ts(end)},{style_name},,0,0,0,,{text}"


def build_ass_from_segments(
    segments: List[Dict[str, Any]],
    play_res_x: int = 1080,
    play_res_y: int = 1920,
    style: Optional[AssStyle] = None,
    animated_pop: bool = True,
) -> str:
    style = style or AssStyle()
    ass = [build_ass_header(play_res_x, play_res_y, style)]

    for seg in segments:
        s = float(seg.get("start", 0.0))
        e = float(seg.get("end", 0.0))
        t = _normalize_text_spacing(str(seg.get("text", "")))
        if not t or e <= s:
            continue

        t = _ass_escape(t)
        if animated_pop:
            t = r"{\fad(80,120)\fscx90\fscy90\t(0,120,\fscx100\fscy100)}" + t
        else:
            t = r"{\fad(60,80)}" + t

        ass.append(_dialogue(s, e, t, "CAPTION", layer=2))

    return "\n".join(ass) + "\n"


def _chunk_words(words: List[Dict[str, Any]], max_chars: int = 34) -> List[List[Dict[str, Any]]]:
    chunks: List[List[Dict[str, Any]]] = []
    cur: List[Dict[str, Any]] = []
    cur_len = 0

    for w in words:
        token = str(w.get("word", "")).strip()
        if not token:
            continue
        w["word"] = token

        add_len = len(token) + (1 if cur else 0)
        pause = 0.0
        if cur:
            pause = max(0.0, float(w["start"]) - float(cur[-1]["end"]))

        if cur and (cur_len + add_len > max_chars or pause > 0.45):
            chunks.append(cur)
            cur = []
            cur_len = 0

        cur.append(w)
        cur_len += add_len

    if cur:
        chunks.append(cur)

    return chunks


def build_ass_karaoke(
    words: List[Dict[str, Any]],
    play_res_x: int = 1080,
    play_res_y: int = 1920,
    style: Optional[AssStyle] = None,
    max_chars_per_line: int = 34,
    animated_word_highlight: bool = True,
) -> str:
    style = style or AssStyle()
    ass = [build_ass_header(play_res_x, play_res_y, style)]

    words = [
        {
            "word": str(w.get("word", w.get("w", ""))).strip(),
            "start": float(w.get("start", w.get("s", 0.0))),
            "end": float(w.get("end", w.get("e", 0.0))),
        }
        for w in words
        if str(w.get("word", w.get("w", ""))).strip()
    ]
    if not words:
        return "\n".join(ass) + "\n"

    chunks = _chunk_words(words, max_chars=max_chars_per_line)

    for chunk in chunks:
        start = float(chunk[0]["start"])
        end = float(chunk[-1]["end"])
        if end <= start:
            continue

        pieces = []
        for w in chunk:
            dur_cs = max(1, int(round((float(w["end"]) - float(w["start"])) * 100)))
            word_txt = _ass_escape(_normalize_text_spacing(w["word"]))
            pieces.append(rf"{{\k{dur_cs}}}{word_txt}")

        line = " ".join(pieces)
        prefix = r"{\fad(60,120)\fscx96\fscy96\t(0,120,\fscx100\fscy100)}"
        ass.append(_dialogue(start, end, prefix + line, "CAPTION", layer=3))

        if animated_word_highlight:
            ass.append(_dialogue(start, end, prefix + line, "EMPH", layer=2))

    return "\n".join(ass) + "\n"


# Compatibility wrappers used by existing code
@dataclass
class WordTiming:
    w: str
    s: float
    e: float


def generate_ass_captions(segments: Iterable[SubtitleSegment], ass_path: Path, hook_text: str | None = None) -> None:
    rows = [{"start": seg.start, "end": seg.end, "text": seg.text} for seg in segments]
    if hook_text:
        rows = [{"start": 0.0, "end": 4.5, "text": hook_text}] + rows
    ass_path.write_text(build_ass_from_segments(rows), encoding="utf-8")


def generate_karaoke_ass(word_timings: list[WordTiming], ass_path: Path, hook_text: str | None = None) -> None:
    rows = [{"w": row.w, "s": row.s, "e": row.e} for row in word_timings]
    ass = build_ass_karaoke(rows)
    if hook_text:
        ass += _dialogue(0.0, 4.5, r"{\fad(100,120)}" + _ass_escape(hook_text), "EMPH", layer=5) + "\n"
    ass_path.write_text(ass, encoding="utf-8")
