"""
Engine 1: Transcriber Module — Audio Source Abstraction Layer

Multi-tier Speech-to-Text Pipeline:
  Tier 1: OpenAI Whisper API (`whisper-1`) — Primary when credits are available.
  Tier 2: Automatic Free Fallback STT (`speech_recognition`) — Activates when OpenAI 
          quota is exhausted (429) or no API key is configured. Zero-cost & unlimited.
"""

import os
import io
import logging
from typing import Optional

logger = logging.getLogger("engine1.transcriber")

try:
    from openai import OpenAI, AuthenticationError, RateLimitError, APIError
    _openai_available = True
except ImportError:
    _openai_available = False

try:
    import speech_recognition as sr
    _sr_available = True
except ImportError:
    _sr_available = False


def _fallback_transcribe(audio_bytes: bytes, audio_format: str, language: Optional[str] = "hi-IN") -> str:
    """Free Tier STT using SpeechRecognition for WAV audio."""
    if not _sr_available or not audio_bytes or len(audio_bytes) < 200:
        return ""
    try:
        r = sr.Recognizer()
        wav_io = io.BytesIO(audio_bytes)
        with sr.AudioFile(wav_io) as source:
            audio_data = r.record(source)
        # Try Hindi first (also recognizes Hinglish), then English
        try:
            return r.recognize_google(audio_data, language=language or "hi-IN")
        except Exception:
            return r.recognize_google(audio_data, language="en-IN")
    except Exception as e:
        logger.debug("Fallback STT could not transcribe chunk: %s", e)
        return ""


def transcribe_chunk(
    audio_bytes: bytes,
    audio_format: str = "webm",
    language: Optional[str] = None,
    previous_text: Optional[str] = None,
) -> dict:
    """
    Transcribe raw audio bytes using OpenAI Whisper API with automatic fallback.

    Returns:
        {
            "text": str,
            "source": "whisper_api" | "free_stt_fallback" | "error",
            "error": Optional[str]
        }
    """
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()

    if not audio_bytes or len(audio_bytes) < 100:
        return {"text": "", "source": "none", "error": None}

    # ── Tier 1: Try OpenAI Whisper API ──────────────────────────────────────
    if api_key and _openai_available:
        try:
            base_url = os.environ.get("OPENAI_BASE_URL", "").strip() or None
            client = OpenAI(api_key=api_key, base_url=base_url)
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = f"chunk.{audio_format}"

            clean_prompt = (previous_text or "")[-200:].strip() if previous_text else None

            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language,
                prompt=clean_prompt or None,
                temperature=0.0,
            )

            transcribed = response.text.strip() if hasattr(response, "text") else ""

            # Filter hallucinated silence artifacts
            if transcribed in [
                "Thank you.", "Thanks for watching!", "Subtitles by the Amara.org community",
                "you", "Bye.", "...", "[silence]", "[applause]"
            ]:
                transcribed = ""

            return {
                "text": transcribed,
                "source": "whisper_api",
                "error": None,
            }

        except RateLimitError as e:
            logger.warning("OpenAI 429 quota exhausted. Switching to free backup STT: %s", e)
            fallback_text = _fallback_transcribe(audio_bytes, audio_format, language)
            return {
                "text": fallback_text,
                "source": "free_stt_fallback",
                "error": None if fallback_text else "OpenAI quota exhausted (429). Using live speech recognition."
            }

        except Exception as e:
            logger.warning("OpenAI transcription error (%s). Using backup STT.", e)
            fallback_text = _fallback_transcribe(audio_bytes, audio_format, language)
            return {
                "text": fallback_text,
                "source": "free_stt_fallback",
                "error": None
            }

    # ── Tier 2: Free Tier Fallback ──────────────────────────────────────────
    fallback_text = _fallback_transcribe(audio_bytes, audio_format, language)
    return {
        "text": fallback_text,
        "source": "free_stt_fallback",
        "error": None,
    }
