from __future__ import annotations

from typing import Any, Dict, List
import shutil
import subprocess


def run(cmd: List[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True)


def burn_ass_subtitles(input_mp4: str, ass_path: str, output_mp4: str) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_mp4,
        "-vf",
        f"ass={ass_path}",
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
        output_mp4,
    ]
    try:
        run(cmd)
    except Exception:
        shutil.copyfile(input_mp4, output_mp4)


def draw_hook_text(input_mp4: str, output_mp4: str, hook_text: str, font_file: str) -> None:
    safe = hook_text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    vf = (
        f"drawtext=fontfile={font_file}:text='{safe}':"
        "fontsize=64:fontcolor=white:borderw=10:bordercolor=black:"
        "box=1:boxcolor=black@0.35:boxborderw=18:"
        "x=(w-text_w)/2:y=90"
    )

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_mp4,
        "-vf",
        vf,
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
        output_mp4,
    ]
    try:
        run(cmd)
    except Exception:
        shutil.copyfile(input_mp4, output_mp4)


def overlay_broll(input_mp4: str, overlays: List[Dict[str, Any]], output_mp4: str) -> None:
    if not overlays:
        shutil.copyfile(input_mp4, output_mp4)
        return

    inputs = ["-i", input_mp4]
    for ov in overlays:
        inputs += ["-i", str(ov["path"])]

    fc_parts = []
    last = "[0:v]"

    for idx, ov in enumerate(overlays, start=1):
        tag = f"[ov{idx}]"
        w = ov.get("w")
        h = ov.get("h")
        x = ov.get("x", "(W-w)/2")
        y = ov.get("y", "(H-h)/2")
        st = float(ov.get("start", 0))
        en = float(ov.get("end", 9999))

        chain = ["format=rgba"]
        if w and h:
            chain.insert(0, f"scale={int(w)}:{int(h)}")

        fc_parts.append(f"[{idx}:v]{','.join(chain)}{tag}")
        outv = f"[v{idx}]"
        fc_parts.append(f"{last}{tag}overlay={x}:{y}:enable='between(t,{st},{en})'{outv}")
        last = outv

    filter_complex = ";".join(fc_parts)

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex",
        filter_complex,
        "-map",
        last,
        "-map",
        "0:a?",
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
        output_mp4,
    ]

    try:
        run(cmd)
    except Exception:
        shutil.copyfile(input_mp4, output_mp4)
