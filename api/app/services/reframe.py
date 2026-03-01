from __future__ import annotations

from pathlib import Path
import shutil
import subprocess


def vertical_reframe(input_video_path: Path, output_video_path: Path) -> None:
    """
    Baseline 9:16 reframing for short-form feeds.
    In production, replace with speaker/face-tracking crop path.
    """
    vf = "scale=-2:1920,crop=1080:1920:(in_w-1080)/2:(in_h-1920)/2"
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_video_path),
        "-vf",
        vf,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "20",
        "-c:a",
        "copy",
        str(output_video_path),
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        shutil.copyfile(input_video_path, output_video_path)
