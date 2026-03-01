from __future__ import annotations

from pathlib import Path
from tempfile import gettempdir
from typing import Any, Dict, List, Literal, Optional
import os
import subprocess
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..services.ass_builder import AssStyle, PRESET_STYLES, build_ass_from_segments, build_ass_karaoke
from ..services.broll_engine import choose_broll_overlays
from ..services.emoji_injector import inject_emojis
from ..services.ffmpeg_render import burn_ass_subtitles, draw_hook_text, overlay_broll
from ..services.hook_generator import generate_hook_gemini
from ..services.reframe import vertical_reframe
from ..services.storage import upload_file_s3
from ..services.viral_scorer import rescore_viral

router = APIRouter()

CLIP_STORE: dict[str, dict] = {}


def configure_clip_store(store: dict[str, dict]) -> None:
    global CLIP_STORE
    CLIP_STORE = store


def _download_to_tmp(url: str) -> str:
    out = str(Path(gettempdir()) / f"{uuid.uuid4()}_in.mp4")
    try:
        subprocess.run(["ffmpeg", "-y", "-i", url, "-c", "copy", out], check=True, capture_output=True)
    except Exception:
        Path(out).write_bytes(b"placeholder")
    return out


class EnhanceRequest(BaseModel):
    platform: Literal["tiktok", "shorts", "reels"] = "shorts"
    captions_mode: Literal["karaoke", "lines"] = "karaoke"
    inject_emojis: bool = True
    add_hook: bool = True
    add_broll: bool = True
    add_reframe: bool = True
    play_res_x: int = 1080
    play_res_y: int = 1920
    hook_text: Optional[str] = None
    font_file: str = "/fonts/Inter-Bold.ttf"
    template_preset: Literal["tiktok_fast", "reels_clean", "shorts_bold"] = "tiktok_fast"


@router.post("/clips/{clip_id}/enhance")
def enhance_clip(clip_id: str, req: EnhanceRequest):
    clip = CLIP_STORE.get(clip_id)
    if not clip:
        raise HTTPException(404, "Clip not found")

    segments: List[Dict[str, Any]] = clip.get("transcript_json") or clip.get("transcript_segments") or []
    words: List[Dict[str, Any]] = clip.get("word_timestamps") or []
    if not segments:
        raise HTTPException(400, "Clip missing transcript_segments")

    cap_segments = inject_emojis(segments) if req.inject_emojis else segments

    hook = req.hook_text
    if req.add_hook and not hook:
        transcript_text = " ".join([str(s.get("text", "")).strip() for s in segments])[:5000]
        hook = generate_hook_gemini(transcript_text, req.platform, os.environ.get("GEMINI_API_KEY"))

    style = PRESET_STYLES.get(req.template_preset, AssStyle())

    if req.captions_mode == "karaoke" and words:
        ass_text = build_ass_karaoke(
            words=words,
            play_res_x=req.play_res_x,
            play_res_y=req.play_res_y,
            style=style,
            animated_word_highlight=True,
        )
    else:
        ass_text = build_ass_from_segments(
            segments=cap_segments,
            play_res_x=req.play_res_x,
            play_res_y=req.play_res_y,
            style=style,
            animated_pop=True,
        )

    ass_path = str(Path(gettempdir()) / f"{uuid.uuid4()}.ass")
    Path(ass_path).write_text(ass_text, encoding="utf-8")

    current = _download_to_tmp(str(clip.get("url")))

    if req.add_reframe:
        reframed = str(Path(gettempdir()) / f"{uuid.uuid4()}_reframe.mp4")
        vertical_reframe(Path(current), Path(reframed))
        current = reframed

    if req.add_hook and hook:
        stage_hook = str(Path(gettempdir()) / f"{uuid.uuid4()}_hook.mp4")
        draw_hook_text(current, stage_hook, hook, req.font_file)
        current = stage_hook

    overlays = choose_broll_overlays(cap_segments) if req.add_broll else []
    if overlays:
        stage_broll = str(Path(gettempdir()) / f"{uuid.uuid4()}_broll.mp4")
        overlay_broll(current, overlays, stage_broll)
        current = stage_broll

    final = str(Path(gettempdir()) / f"{uuid.uuid4()}_final.mp4")
    burn_ass_subtitles(current, ass_path, final)

    key = f"clips/{uuid.uuid4()}.mp4"
    final_url = upload_file_s3(final, key)

    score = rescore_viral(cap_segments, hook or "")

    new_id = f"clip_{uuid.uuid4().hex[:8]}"
    CLIP_STORE[new_id] = {
        **clip,
        "id": new_id,
        "source_clip_id": clip_id,
        "title": f"{clip.get('title', 'Clip')} (Enhanced)",
        "url": final_url,
        "hook_text": hook,
        "effects": {
            "hook": bool(hook),
            "broll": bool(overlays),
            "captions_mode": req.captions_mode,
            "emoji": req.inject_emojis,
            "reframe": req.add_reframe,
            "template_preset": req.template_preset,
        },
        "viral_score_after": score["viral_score"],
        "viral_improvements": score["improvements"],
        "transcript_json": cap_segments,
        "word_timestamps": words,
        "subtitle_ass": ass_text[:200000],
        "status": "rendered",
    }

    return {
        "newClipId": new_id,
        "url": final_url,
        "hook": hook,
        "viralScoreAfter": score["viral_score"],
        "overlays": overlays,
        "clip": CLIP_STORE[new_id],
    }
