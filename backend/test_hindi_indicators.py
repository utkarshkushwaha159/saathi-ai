import sys
import os
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(__file__))

from app.ai_engine_1.indicators import detect_indicators, _load_config
from app.ai_engine_1.svi_engine import SVIState, update_svi
from app.ai_engine_1.copilot import get_copilot_suggestion

cfg = _load_config()

test_phrases = [
    ("मुझे बहुत डर लग रहा है, वो धमकी दे रहा है", "Distress + Fear"),
    ("दरवाजे के बाहर कोई खड़ा है, मैं बिल्कुल अकेली हूं", "Isolation + Immediate Safety"),
    ("मार देंगे बोल रहा है, प्लीज मदद करो", "Threat + Distress"),
    ("पुलिस आ गई है, अब सब ठीक है और मैं सुरक्षित हूं", "Calming signal")
]

print("=== TESTING ENGINE 1 INDICATOR DETECTION ===")
for phrase, desc in test_phrases:
    indicators, raw_distress, calming = detect_indicators(phrase, cfg)
    print(f"\n[Test] {desc}")
    print(f"  Input: {phrase}")
    print(f"  Raw Distress Score: {raw_distress}, Calming Factor: {calming}")
    print(f"  Detected Matches ({len(indicators)}):")
    for ind in indicators:
        print(f"    - [{ind.ui_label}] Matched: '{ind.matched_phrase}' | Calming: {ind.is_calming} | Weight: {ind.weight}")

print("\nAll indicator tests completed successfully!")
