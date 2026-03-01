from __future__ import annotations

from typing import Iterable, Optional
import json
import re

import requests

from ..subtitles import SubtitleSegment

GEMINI_MODEL = "gemini-1.5-pro"

HOOK_TEMPLATES = [
    "Nobody tells you this about {topic}",
    "This is why most people fail at {topic}",
    "The {topic} mistake that kills growth",
    "Watch this before your next {topic} move",
]


def _topic_from_segments(segments: Iterable[SubtitleSegment]) -> str:
    text = " ".join(seg.text for seg in segments).lower()
    if "retention" in text:
        return "retention"
    if "growth" in text:
        return "growth"
    if "content" in text:
        return "content"
    if "podcast" in text:
        return "podcasts"
    return "editing"


def generate_hook_text(segments: list[SubtitleSegment], platform: str = "tiktok") -> str:
    topic = _topic_from_segments(segments)
    template = HOOK_TEMPLATES[len(segments) % len(HOOK_TEMPLATES)]
    hook = template.format(topic=topic)
    words = hook.split()
    if len(words) > 10:
        hook = " ".join(words[:10])
    return hook


def build_gemini_hook_prompt(transcript_text: str, platform: str) -> str:
    return f"""
You are a short-form video editor. Create ONE punchy hook text overlay for the first 2 seconds.

Rules:
- 6 to 10 words max
- MUST be curiosity-driven (question, contradiction, surprising claim)
- No hashtags, no emojis, no quotes
- No brand names unless mentioned in transcript
- Must match platform: {platform}
- Output JSON only: {{"hook":"..."}}

Transcript:
{transcript_text}
""".strip()


def _extract_json(text: str) -> Optional[dict]:
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None


def generate_hook_gemini(transcript_text: str, platform: str, api_key: str | None = None) -> str:
    key = api_key
    if not key:
        return generate_hook_text([SubtitleSegment(start=0, end=1, text=transcript_text[:120])], platform)

    prompt = build_gemini_hook_prompt(transcript_text, platform)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.6, "maxOutputTokens": 120},
    }

    response = requests.post(url, json=payload, timeout=30)
    response.raise_for_status()
    data = response.json()

    text = ""
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        text = str(data)

    parsed = _extract_json(text) or {}
    hook = str(parsed.get("hook", "")).strip()
    hook = re.sub(r"\s+", " ", hook)

    words = hook.split(" ")
    if len(words) > 10:
        hook = " ".join(words[:10])

    if not hook:
        hook = generate_hook_text([SubtitleSegment(start=0, end=1, text=transcript_text[:120])], platform)

    return hook[:80]
