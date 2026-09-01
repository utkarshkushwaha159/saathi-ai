"""
Engine 1: Operator Co-Pilot Module

Returns one suggested next question and one communication tip based on
current SVI label. All logic is in config.json (copilot_rules) so it can
be updated without code changes.

DESIGN NOTE: This function is deliberately isolated so it can be swapped
for an LLM-based call (e.g., GPT-4 with transcript context) in a later
phase without modifying the rest of the engine pipeline.
"""

from typing import Optional


def get_copilot_suggestion(
    svi_label: str,
    config: dict,
    full_transcript: Optional[str] = None,
) -> dict:
    """
    Returns rule-based co-pilot guidance based on current SVI label.

    Args:
        svi_label: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
        config: full Engine 1 config dict
        full_transcript: currently unused (reserved for future LLM upgrade)

    Returns:
        {
            "suggested_question": str,
            "communication_tip": str,
            "source": "rule_based"  # will be "llm" when upgraded
        }

    Future LLM upgrade point: replace this function body with an async call
    to OpenAI/Gemini using full_transcript as context while keeping the
    same return schema.
    """
    rules = config.get("copilot_rules", {})
    rule = rules.get(svi_label, rules.get("LOW", {}))

    return {
        "suggested_question": rule.get(
            "suggested_question",
            "Kya aap mujhe apni current situation ke baare mein bata sakte hain?"
        ),
        "communication_tip": rule.get(
            "communication_tip",
            "Stay calm and reassuring. Listen carefully before responding."
        ),
        "source": "rule_based",  # Change to "llm" when LLM is integrated
    }
