"""
Engine 1: Indicators Module
Rule-based, context-aware detection of distress/threat/isolation signals.

Design note: All phrase lists are loaded from config.json — no hardcoded keywords here.
Context-awareness: calming phrases from any category reduce the running score rather
than just adding to a keyword count.
"""

import json
import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional


CONFIG_PATH = Path(__file__).parent / "config.json"


def _load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return json.load(f)


@dataclass
class IndicatorMatch:
    category: str
    ui_label: str
    matched_phrase: str
    evidence_snippet: str
    weight: float  # 0-100 scaled contribution to SVI
    is_calming: bool = False


def _normalize(text: str) -> str:
    """Lowercase and strip punctuation for matching."""
    return re.sub(r"[^\w\s]", " ", text.lower())


def detect_indicators(
    text: str,
    config: dict,
    chunk_duration_seconds: float = 3.5,
) -> tuple[List[IndicatorMatch], float, float]:
    """
    Analyze a single transcript chunk for distress indicators and calming signals.

    Returns:
      - indicators: list of IndicatorMatch (both threat and calming)
      - raw_distress_score: 0-100, sum of matched threat weights (capped)
      - calming_factor: 0.0-1.0, strength of de-escalation signals detected

    NOTE: This function only analyzes the *current* chunk text.
    The SVI engine handles cross-chunk context and score decay.
    """
    config = config or _load_config()
    normalized = _normalize(text)
    words = normalized.split()
    word_count = len(words)

    indicators: List[IndicatorMatch] = []
    total_distress_weight = 0.0
    total_calming_weight = 0.0

    for cat_key, cat_cfg in config.get("indicator_categories", {}).items():
        cat_weight = cat_cfg.get("weight", 20)
        ui_label = cat_cfg.get("ui_label", cat_key)

        # Check distress phrases
        for phrase in cat_cfg.get("phrases", []):
            norm_phrase = _normalize(phrase)
            if norm_phrase in normalized:
                # Extract a small evidence snippet (up to 8 words around the match)
                idx = normalized.find(norm_phrase)
                start_char = max(0, idx - 30)
                end_char = min(len(text), idx + len(phrase) + 30)
                snippet = text[start_char:end_char].strip()

                indicators.append(
                    IndicatorMatch(
                        category=cat_key,
                        ui_label=ui_label,
                        matched_phrase=phrase,
                        evidence_snippet=f"...{snippet}...",
                        weight=cat_weight,
                        is_calming=False,
                    )
                )
                total_distress_weight += cat_weight
                break  # One match per category per chunk is enough

        # Check calming phrases
        for phrase in cat_cfg.get("calming_phrases", []):
            norm_phrase = _normalize(phrase)
            if norm_phrase in normalized:
                idx = normalized.find(norm_phrase)
                start_char = max(0, idx - 20)
                end_char = min(len(text), idx + len(phrase) + 20)
                snippet = text[start_char:end_char].strip()

                indicators.append(
                    IndicatorMatch(
                        category=cat_key,
                        ui_label=ui_label,
                        matched_phrase=phrase,
                        evidence_snippet=f"...{snippet}...",
                        weight=cat_weight * 0.6,  # calming = partial reversal
                        is_calming=True,
                    )
                )
                total_calming_weight += cat_weight * 0.6
                break

    # Cap raw distress contribution per chunk
    max_contrib = config.get("svi_config", {}).get("max_single_chunk_contribution", 48)
    raw_distress_score = min(total_distress_weight, max_contrib)

    # Calming factor: 0.0 (no calming) to 1.0 (strong calming)
    calming_factor = min(total_calming_weight / 80.0, 1.0)

    return indicators, raw_distress_score, calming_factor


def compute_speech_pace_score(
    word_count: int,
    chunk_duration_seconds: float,
    pace_config: dict,
) -> tuple[float, str]:
    """
    PROTOTYPE APPROXIMATION: Estimate speech urgency from words-per-minute.
    This is NOT prosody/acoustic analysis — it is a surface-level proxy only.
    Label in UI accordingly (see LiveSession tooltip text).

    Returns: (contribution_score 0-100, pace_label)
    """
    if chunk_duration_seconds <= 0:
        return 0.0, "unknown"

    wpm = (word_count / chunk_duration_seconds) * 60.0

    slow_thresh = pace_config.get("slow_wpm_threshold", 60)
    fast_thresh = pace_config.get("fast_wpm_threshold", 220)

    if wpm < slow_thresh:
        # Very slow speech can indicate shock/fear
        score = pace_config.get("slow_distress_weight", 12)
        label = "slow"
    elif wpm > fast_thresh:
        # Very fast, fragmented speech can indicate panic
        score = pace_config.get("fast_panic_weight", 18)
        label = "rapid"
    else:
        score = pace_config.get("normal_contribution", 0)
        label = "normal"

    return float(score), label
