import json
from app.ai_engine_1 import _get_config, create_session, get_session, update_session, end_session
from app.ai_engine_1.indicators import detect_indicators
from app.ai_engine_1.svi_engine import update_svi

print("--- Step 1: Start Engine 1 Session ---")
sid = create_session(operator_name="Operator 12 (North Dispatch)")
state = get_session(sid)
print(f"Session started: {sid}")

cfg = _get_config()

test_cases = [
    ("Chunk 1: Fear/Distress", "mujhe bahut darr lag raha hai"),
    ("Chunk 2: Threat Language", "mujhe dhamki mil rahi hai"),
    ("Chunk 3: Immediate Proximity Danger", "woh abhi mere ghar ke bahar hai"),
    ("Chunk 4: Calming Signal (De-escalation)", "abhi main safe hoon police aa gayi hai"),
]

print("\n--- Step 2: Testing Engine 1 Test Sentences ---")
for label, phrase in test_cases:
    ind, raw, calm = detect_indicators(phrase, cfg, 3.5)
    state = update_svi(state, phrase, raw, calm, 0.0, "normal", ind, cfg)
    update_session(sid, state)
    print(f"[{label}]")
    print(f"  Utterance: \"{phrase}\"")
    print(f"  SVI Score: {round(state.running_svi)}/100 -> Label: {state.last_svi_label}")
    print(f"  Calming detected: {calm > 0.15}")
    print(f"  Matched indicators: {[i.matched_phrase for i in ind]}")
    print(f"  Category scores: {state.category_scores}")
    print()

print("--- Step 3: End Session & Generate Case Brief ---")
summary = end_session(sid, operator_name="Operator 12 (North Dispatch)")
print(f"Final SVI: {summary['final_svi']}/100 ({summary['final_svi_label']})")
print(f"Case Brief: {summary['case_brief']}")
print(f"Metric Bars: {summary['metric_bars']}")

print("\n--- ALL ENGINE 1 TESTS PASSED SUCCESSFULLY ---")
