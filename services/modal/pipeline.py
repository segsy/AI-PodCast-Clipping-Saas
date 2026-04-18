"""Modal worker pipeline skeleton.

This module defines the order of operations for clip generation:
1) whisperX transcription
2) Gemini highlight detection
3) LR-ASD active speaker windows
4) FFmpegCV crop + subtitle burn-in
"""

from dataclasses import dataclass


@dataclass
class ClipSegment:
    start_s: float
    end_s: float
    hook: str


def transcribe_with_whisperx(video_path: str) -> str:
    return f"transcript_for:{video_path}"


def detect_viral_segments(transcript: str) -> list[ClipSegment]:
    _ = transcript
    return [ClipSegment(start_s=12.0, end_s=44.0, hook="Unexpected founder story")]


def detect_active_speaker(video_path: str, start_s: float, end_s: float) -> dict:
    _ = (video_path, start_s, end_s)
    return {"crop": "9:16_face_tracking"}


def render_vertical_clip(video_path: str, segment: ClipSegment, speaker_meta: dict) -> str:
    _ = speaker_meta
    return f"rendered/{video_path.split('/')[-1]}_{int(segment.start_s)}_{int(segment.end_s)}.mp4"


def process_video(video_path: str) -> list[str]:
    transcript = transcribe_with_whisperx(video_path)
    segments = detect_viral_segments(transcript)
    outputs: list[str] = []

    for segment in segments:
        speaker_meta = detect_active_speaker(video_path, segment.start_s, segment.end_s)
        outputs.append(render_vertical_clip(video_path, segment, speaker_meta))

    return outputs
