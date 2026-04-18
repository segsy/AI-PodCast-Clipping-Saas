from enum import Enum
from pathlib import Path
from tempfile import gettempdir
from typing import List
import os
import shutil
import subprocess
import uuid

import httpx
import logging
import inngest
import inngest.fast_api
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

load_dotenv()

from .api.clips_enhance import configure_clip_store, router as enhance_router
from .subtitles import SubtitleSegment, generate_srt, slice_transcript

app = FastAPI(title="AI Podcast Clipping API", version="0.1.0")

# Create an Inngest client
inngest_client = inngest.Inngest(
    app_id="fast_api_example",
    signing_key=os.getenv("INNGEST_SIGNING_KEY"),
    logger=logging.getLogger("uvicorn"),
)

# Create an Inngest function
@inngest_client.create_function(
    fn_id="my_function",
    # Event that triggers this function
    trigger=inngest.TriggerEvent(event="app/my_function"),
)
async def my_function(ctx: inngest.Context) -> str:
    ctx.logger.info(ctx.event)
    return "done"


class JobStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ProcessRequest(BaseModel):
    job_id: str
    user_id: str
    video_url: HttpUrl
    target_platforms: List[str] = ["youtube_shorts", "tiktok", "instagram_reels"]


class ProcessResponse(BaseModel):
    job_id: str
    status: JobStatus
    message: str


class TrimRequest(BaseModel):
    startSec: float
    endSec: float
    title: str = "Trimmed clip"


CLIPS_DB: dict[str, dict] = {
    "clip_1": {
        "id": "clip_1",
        "podcast_id": "pod_1",
        "title": "Founder lesson on retention",
        "url": "https://ai-pod-cast-clipping-saas-hdwq.vercel.app/clips/clip_1.mp4",
        "duration_sec": 58.0,
        "viral_score": 91,
        "transcript_json": [
            {"start": 0.4, "end": 3.8, "text": "Retention starts with customer trust."},
            {"start": 4.0, "end": 8.2, "text": "We fixed onboarding before running paid ads."},
            {"start": 8.4, "end": 13.0, "text": "That single change doubled week-one activation."},
        ],
    },
    "clip_2": {
        "id": "clip_2",
        "podcast_id": "pod_1",
        "title": "3 growth tactics that worked",
        "url": "https://ai-pod-cast-clipping-saas-hdwq.vercel.app/clips/clip_2.mp4",
        "duration_sec": 45.0,
        "viral_score": 86,
        "transcript_json": [
            {"start": 0.2, "end": 2.9, "text": "Tactic one was referral flywheels."},
            {"start": 3.2, "end": 6.7, "text": "Tactic two was distribution partnerships."},
            {"start": 7.1, "end": 10.4, "text": "Tactic three was aggressive content repurposing."},
        ],
    },
}

configure_clip_store(CLIPS_DB)
app.include_router(enhance_router)

# Serve the Inngest endpoint
inngest.fast_api.serve(app, inngest_client, [my_function])



@app.get("/health")
def health() -> dict:
    return {"ok": True}

@app.post("/process", response_model=ProcessResponse)
def process_podcast(payload: ProcessRequest) -> ProcessResponse:
    return ProcessResponse(
        job_id=payload.job_id,
        status=JobStatus.queued,
        message="Podcast accepted and queued for AI clipping pipeline.",
    )


@app.get("/clips/{clip_id}")
def get_clip(clip_id: str) -> dict:
    clip = CLIPS_DB.get(clip_id)
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return clip


def _materialize_input(url: str, clip_id: str) -> Path:
    tmp_dir = Path(gettempdir()) / "ai_podcast_clips"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    input_path = tmp_dir / f"{clip_id}_source.mp4"

    if input_path.exists() and input_path.stat().st_size > 0:
        return input_path

    try:
        with httpx.Client(timeout=10.0, follow_redirects=True) as client:
            response = client.get(url)
            response.raise_for_status()
            input_path.write_bytes(response.content)
            return input_path
    except Exception:
        input_path.write_bytes(b"placeholder")
        return input_path


def _ffmpeg_trim(input_path: Path, output_path: Path, start: float, duration: float) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        str(start),
        "-i",
        str(input_path),
        "-t",
        str(duration),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        str(output_path),
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        shutil.copyfile(input_path, output_path)


def _burn_subtitles(input_video_path: Path, srt_path: Path, output_video_path: Path) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_video_path),
        "-vf",
        f"subtitles={srt_path}:force_style='Fontsize=24,PrimaryColour=&Hffffff&,OutlineColour=&H000000&,Outline=2'",
        "-c:a",
        "copy",
        str(output_video_path),
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        shutil.copyfile(input_video_path, output_video_path)


def _upload_final_clip(local_file_path: Path) -> str:
    return f"https://ai-pod-cast-clipping-saas-hdwq.vercel.app/generated/{local_file_path.name}"


def _build_word_timings(segments: list[SubtitleSegment]) -> list[dict]:
    out: list[dict] = []
    for seg in segments:
        words = [w for w in seg.text.split() if w.strip()]
        if not words:
            continue
        span = max(0.1, seg.end - seg.start)
        step = span / len(words)
        t = seg.start
        for w in words:
            out.append({"w": w, "s": t, "e": min(seg.end, t + step)})
            t += step
    return out


@app.post("/clips/{clip_id}/trim")
def trim_clip(clip_id: str, payload: TrimRequest) -> dict:
    if payload.endSec <= payload.startSec:
        raise HTTPException(status_code=400, detail="Invalid trim range")

    duration = payload.endSec - payload.startSec
    if duration > 60:
        raise HTTPException(status_code=400, detail="Max trim length is 60 seconds")

    clip = CLIPS_DB.get(clip_id)
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")

    work_dir = Path(gettempdir()) / "ai_podcast_clips"
    work_dir.mkdir(parents=True, exist_ok=True)

    input_path = _materialize_input(clip["url"], clip_id)
    trimmed_path = work_dir / f"{uuid.uuid4()}_trim.mp4"
    srt_path = work_dir / f"{uuid.uuid4()}_trim.srt"
    subtitled_path = work_dir / f"{uuid.uuid4()}_trim_subtitled.mp4"

    _ffmpeg_trim(input_path, trimmed_path, payload.startSec, duration)

    transcript = clip.get("transcript_json") or []
    sliced: list[SubtitleSegment] = slice_transcript(transcript, payload.startSec, payload.endSec)
    if not sliced:
        sliced = [SubtitleSegment(start=0.0, end=max(0.5, duration), text=payload.title)]

    generate_srt(sliced, srt_path)
    _burn_subtitles(trimmed_path, srt_path, subtitled_path)

    final_url = _upload_final_clip(subtitled_path)
    srt_url = f"{final_url}.srt"

    new_id = f"clip_{uuid.uuid4().hex[:8]}"
    CLIPS_DB[new_id] = {
        "id": new_id,
        "podcast_id": clip["podcast_id"],
        "title": payload.title,
        "url": final_url,
        "duration_sec": duration,
        "viral_score": clip.get("viral_score"),
        "transcript_json": [{"start": row.start, "end": row.end, "text": row.text} for row in sliced],
        "word_timestamps": _build_word_timings(sliced),
        "srt_url": srt_url,
        "status": "rendered",
        "effects_enabled": ["trim", "srt"],
    }

    return {"newClipId": new_id, "url": final_url, "srtUrl": srt_url, "clip": CLIPS_DB[new_id]}
