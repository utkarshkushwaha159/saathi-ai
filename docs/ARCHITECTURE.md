# SAATHI-AI Architecture Overview

SAATHI-AI (Smart India Hackathon SIH26093) is an AI-assisted decision-support platform designed for emergency/distress helpline operators. It is architected around two specialized, complementary AI engines operating under a human-in-the-loop governance model.

---

## High-Level Data Flow

```text
[ Caller / Inbound Interaction ]
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 1: Live Interaction & Real-Time Triage Engine       │
│  - Real-time transcription stream                           │
│  - Distress indicator extraction                            │
│  - Stress Vulnerability Index (SVI) computation (0-100)     │
│  - Operator Co-Pilot guidance & de-escalation cues          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Case Creation & Structured Intake Record                   │
│  - Structured case metadata, transcript snapshots           │
│  - Preliminary category & priority score                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 2: Historical Intelligence & Case Analytics         │
│  - Semantic case similarity & matching                      │
│  - Regional & temporal distress pattern detection           │
│  - Delay-risk prediction & resource bottleneck alerts       │
│  - Resolution path recommendations                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Human Operator / Supervisor Decision Point                 │
│  - Reviews explainable AI signals (evidence + confidence)   │
│  - Makes 100% of diagnostic, triage, and dispatch decisions │
│  - Can accept, adjust, or override any AI suggestion        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Comprehensive Audit & Action Log                           │
│  - Immutable log of all AI inferences & human decisions     │
│  - Captures overrides, justifications, and response times   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Engine 1: Live Analysis & Operator Co-Pilot
- **Purpose**: Process real-time inbound helpline audio/text streams during active calls.
- **Key Responsibilities**:
  - Continuous live transcription.
  - Distress signal identification (acoustic/linguistic cues).
  - Computation of the **Stress Vulnerability Index (SVI)** on a scale of 0–100.
  - Contextual co-pilot recommendations (suggested de-escalation phrases, safety checklists, emergency dispatch triggers).

### 2. Engine 2: Historical Intelligence & Pattern Analytics
- **Purpose**: Analyze recorded cases against historical knowledge bases and regional trends.
- **Key Responsibilities**:
  - Vector-based semantic search to identify similar prior cases and successful intervention paths.
  - Detection of systemic patterns (e.g., regional clusters of specific distress types).
  - Delay-risk scoring for open cases to prevent operational bottlenecks.

### 3. Human-in-the-Loop Decision Layer
- **Mandate**: AI serves exclusively as a decision-support assistant. No critical dispatch, categorization, or legal/medical determinations occur without explicit human authorization.
- Every AI output is accompanied by transparent rationale, evidence citations, and confidence scores.

### 4. Audit & Compliance Log
- Every AI suggestion, operator action, manual override, and timestamp is stored for accountability, review, and continuous training.
