# SAATHI-AI (Smart India Hackathon - SIH26093)

> **AI-Assisted Decision-Support Platform for Emergency & Distress Helplines**  
> *Human-in-the-Loop Triage, Live Interaction Intelligence, and Historical Case Reasoning*

---

## 📌 1. Project Overview

**SAATHI-AI** is a high-reliability, explainable decision-support system engineered for emergency helpline operators and supervisors. Helplines handle critical, high-stress citizen interactions where rapid triage, accurate contextual history, and compassionate de-escalation are paramount.

The platform assists helpline staff in real-time by transcribing speech, detecting observable distress and isolation indicators, calculating the calibrated **Survivor Vulnerability Index (SVI)**, providing contextual co-pilot guidance, and performing historical case intelligence.

---

## ❓ 2. Problem Being Solved

- **Operator Cognitive Overload**: Emergency call handlers must simultaneously listen, calm distressed callers, extract critical threat indicators, and make high-stakes triage decisions under extreme pressure.
- **Hidden Escalation Risks**: Subtle distress signals, isolation cues, and speech pace variations can be missed during fast-paced calls.
- **Fragmented Historical Context**: Operators often lack immediate visibility into related past incidents, recurring regional patterns, or delay-prone resolution bottlenecks.
- **Need for Explainability & Safety**: Critical emergency systems cannot rely on black-box AI. Every recommendation must be auditable, explainable, and under human control.

---

## 🧠 3. Two-AI Architecture

SAATHI-AI separates live call processing from deep retrospective analysis through two specialized AI engines governed by a strict **Human-in-the-Loop** model:

```
                               ┌──────────────────────────────────────────────┐
                               │             CALLER AUDIO STREAM              │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ AI ENGINE 1: Live Interaction & Real-Time Triage Intelligence                                          │
 │ ────────────────────────────────────────────────────────────────────────────────────────────────────── │
 │ • Real-Time Speech-to-Text: OpenAI Whisper API & Free fallback SpeechRecognition (Hindi / Hinglish / EN)│
 │ • Deduplicated Live Captions & Bilingual Indicator Detection                                           │
 │ • Observable Indicators: Threat language, Fear/Distress tone, Immediate safety cues, Isolation signals │
 │ • Survivor Vulnerability Index (SVI 0-100): Calibrated score with decay, smoothing & calming factors   │
 │ • Operator Co-Pilot Assistant: Contextual next-best questions & communication guidance                 │
 │ • Post-Call Case Brief Generation: Automated natural-language summary for case records                 │
 └────────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                      │
                                                      ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ AI ENGINE 2: Historical Case Intelligence & Pattern Reasoning                                         │
 │ ────────────────────────────────────────────────────────────────────────────────────────────────────── │
 │ • Semantic Similarity Matching: TF-IDF & Cosine Similarity across historical case archives             │
 │ • Related Case Resolution Retrieval: Surfaces successful resolution paths from past incidents          │
 │ • Regional Pattern & Cluster Detection: Identifies recurring incidents by geographic sector           │
 │ • Delay-Risk Intelligence: Flags bottlenecks (e.g., pending forensics, jurisdictional disputes)       │
 │ • Explainable AI Reasoning Breakdown: Step-by-step scoring contributions & full audit trail            │
 └────────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           HUMAN OPERATOR / SUPERVISOR        │
                               │  (Retains 100% final decision authority)    │
                               └──────────────────────────────────────────────┘
```

### AI Engine 1: Live Interaction Intelligence
- **Real-Time Speech-to-Text**: Captures live audio in webm/wav format, transcribing Hindi (Devanagari), Hinglish, and English.
- **Live Captions**: Deduplicated, real-time transcript display for operators.
- **Observable Indicators**: Pattern-matched threat keywords, panic expressions, and isolation signals with evidence snippets.
- **Survivor Vulnerability Index (SVI)**: Calibrated 0–100 scale with category-level scores (Distress keywords, Voice tone, Isolation signal, Speech pace).
- **Operator Co-Pilot**: Dynamically updates suggested clarifying questions and de-escalation tips based on the running SVI level.
- **Case Brief Generator**: Automatically produces structured, factual summaries at call termination.

### AI Engine 2: Historical Case Intelligence
- **Semantic Similarity**: Matches the current incident against historical case archives to identify precedent cases.
- **Resolution Intelligence**: Recommends proven action paths based on past case outcomes.
- **Pattern & Cluster Detection**: Highlights regional recurrence and systemic bottlenecks.
- **Delay-Risk Analysis**: Evaluates case factors to alert supervisors of potential SLA breaches.
- **Audit & Human Override**: Every AI suggestion can be reviewed, overridden, and logged with operator rationale.

---

## 🏗️ 4. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, SQLite
- **Speech & AI**: OpenAI Whisper API, SpeechRecognition (Google Free Tier fallback), scikit-learn (TF-IDF vectorizer & cosine similarity), OmniRoute Gateway support
- **Design System**: Strict high-contrast palette, 1px structural borders (no blur/drop shadows), SVI semi-circle radial gauge

---

## 📂 5. Project Structure

```text
Saathi Ai/
├── frontend/                  # Next.js 16 (App Router, TypeScript, Tailwind CSS)
│   ├── src/
│   │   ├── app/               # Next.js pages and layouts
│   │   │   ├── page.tsx       # Live call workspace & Engine 1 triage dashboard
│   │   │   ├── layout.tsx     # Global layout and navigation header
│   │   │   └── globals.css    # Tailwind CSS and global styling tokens
│   │   └── components/        # Reusable UI components
│   │       ├── SVIArcGauge.tsx             # Calibrated semi-circle SVI gauge
│   │       ├── CaseReasoningView.tsx       # Explainable AI reasoning breakdown
│   │       ├── Engine2HistoricalView.tsx   # Historical case matching & pattern radar
│   │       └── ...
│   ├── package.json
│   └── tsconfig.json
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI entrypoint & router configuration
│   │   ├── database.py        # SQLite database session and schema initialization
│   │   ├── models/            # SQLAlchemy database models
│   │   │   └── case_model.py  # Case, audit log, and triage models
│   │   ├── routers/           # API endpoints (live sessions, cases, analytics)
│   │   ├── ai_engine_1/       # Live Interaction & Real-Time SVI Engine
│   │   │   ├── __init__.py    # Pipeline coordinator
│   │   │   ├── indicators.py  # Bilingual keyword & pace detection
│   │   │   ├── svi_engine.py  # SVI calculation, decay, and smoothing
│   │   │   ├── copilot.py     # Rule-based co-pilot suggestions
│   │   │   ├── transcriber.py # Multi-tier STT (Whisper + fallback)
│   │   │   ├── case_brief.py  # Post-call case brief generator
│   │   │   └── config.json    # Indicator weights & phrase dictionary
│   │   └── ai_engine_2/       # Historical Case Intelligence Engine
│   │       ├── case_matcher.py# Semantic TF-IDF similarity matcher
│   │       └── pattern_engine.py # Regional cluster & delay-risk analysis
│   ├── requirements.txt       # Python dependencies
│   └── test_hindi_indicators.py # Unit tests for bilingual indicator matching
├── docs/                      # Architectural & Policy Documentation
│   ├── ARCHITECTURE.md        # Deep architectural design & data flow
│   ├── SAFETY_PRINCIPLES.md   # Ethical AI guardrails & human override mandates
│   ├── DEMO_DATA_POLICY.md    # Synthetic data usage & privacy policy
│   └── DESIGN_SYSTEM.md       # Visual design specification
├── .env.example               # Template environment configuration
├── .gitignore                 # Root Git exclusion rules
└── README.md                  # Project overview & documentation
```

---

## ⚙️ 6. Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```env
# Backend Configuration
ENVIRONMENT=development
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
DATABASE_URL=sqlite:///./saathi_dev.db
ALLOWED_ORIGINS=http://localhost:3000

# Speech-to-Text & AI Briefings (OpenAI / OpenAI-compatible Gateway)
OPENAI_API_KEY=your_openai_api_key_here
# Optional: Set base URL if using local gateway or custom proxy (e.g., OmniRoute)
# OPENAI_BASE_URL=http://127.0.0.1:20128/v1

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

> **Note**: If `OPENAI_API_KEY` is not provided or quota is exhausted (HTTP 429), SAATHI-AI automatically switches to the built-in free SpeechRecognition fallback so live audio continues to function seamlessly without downtime.

---

## 🚀 7. Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: v3.10+
- **Git**

### Step 1: Backend Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Verify backend at [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) or [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Step 2: Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎙️ 8. How to Test the Live Interaction System

1. Open **[http://localhost:3000](http://localhost:3000)**.
2. Click **Start Live Session** and grant microphone permissions when prompted.
3. Speak into your microphone in **Hindi**, **Hinglish**, or **English**. Try phrases such as:
   - *"मुझे बहुत डर लग रहा है, वो मुझे धमकी दे रहा है"* ➔ Activates **Distress keywords** and **Voice tone** factors, raising SVI to HIGH.
   - *"दरवाजे के बाहर कोई खड़ा है और मैं बिल्कुल अकेली हूं"* ➔ Activates **Isolation signal** and **Immediate safety** factors.
   - *"पुलिस आ गई है, अब सब ठीक है और मैं सुरक्षित हूं"* ➔ Triggers **Calming reduction**, smoothly lowering the SVI score.
4. Observe the live updates:
   - **Radial Arc Gauge**: Reflects current calibrated SVI level (LOW, MODERATE, HIGH, CRITICAL).
   - **Contributing Factors**: Breakdown bars showing Distress keywords, Voice tone, Isolation signal, and Speech pace.
   - **Observable Indicators**: Highlighted evidence snippets from caller speech.
   - **Operator Co-Pilot**: Recommended clarifying questions and de-escalation tips.
5. Click **End Session** to view the auto-generated **Case Brief** and transfer the case to Engine 2 for historical comparison.

---

## 🔒 9. Synthetic / Demo Data Disclaimer

- **100% Synthetic & Anonymized**: All cases, caller names, locations, phone numbers, and operational records in this repository are entirely fictional, generated for demonstration and testing purposes.
- **No Production Government / NHAA Data**: This prototype does not connect to, query, or store any real citizen emergency helpline or National Highway Authority / Government production records.
- See [docs/DEMO_DATA_POLICY.md](docs/DEMO_DATA_POLICY.md) for our detailed demo data governance policy.

---

## 🛡️ 10. Privacy & Ethical AI Guardrails

- **Human-in-the-Loop (HITL) Mandate**: AI outputs are strictly decision-support advisories. A human operator always retains final decision authority on case classifications, dispatches, and resolutions.
- **No Autonomous Legal / Medical Diagnosis**: SAATHI-AI explicitly refrains from making diagnostic, legal culpability, or psychological determinations.
- **Full Auditability**: Every score update, indicator detection, and operator override is logged in an immutable audit trail.
- See [docs/SAFETY_PRINCIPLES.md](docs/SAFETY_PRINCIPLES.md) for ethical principles.

---

## ⚠️ 11. Current Limitations

- **Speech Pace as Heuristic**: Speech pace is currently calculated from words-per-minute (WPM) chunk velocity rather than raw acoustic prosody analysis.
- **Local SQLite Store**: Default configuration uses SQLite for local portability during hackathon evaluation. Production deployment should target PostgreSQL.
- **Acoustic Background Classification**: Background noise classification (e.g. glass breaking, sirens) is in prototype exploration.

---

## 🔮 12. Future Scope

- **Multi-lingual Dialect Adaptation**: Expansion to 12+ regional Indian dialects (Bhojpuri, Marathi, Tamil, Bengali, Telugu, Gujarati, etc.).
- **Acoustic Prosody & Tone Neural Network**: Dedicated acoustic model for emotional inflection and stress tone classification beyond lexical keywords.
- **Computer-Aided Dispatch (CAD) Integration**: Standardized integration APIs for 112 / ERSS and local emergency services.
- **Offline Edge Mode**: On-device lightweight models (Whisper Tiny / ONNX) for zero-connectivity field units.

---

## 📄 License & Attribution

Developed for **Smart India Hackathon (SIH26093)**. All rights reserved.
