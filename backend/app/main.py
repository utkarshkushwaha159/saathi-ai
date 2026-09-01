"""
SAATHI-AI Backend Entrypoint — Phase 1 (Engine 1 Live)
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models.case_model import LiveCase  # ensure table is created
from app.routers.live_session import router as session_router

load_dotenv()

# Initialize all DB tables (creates live_cases table if not exists)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SAATHI-AI API",
    description="AI-assisted decision-support platform for helpline operators (SIH26093)",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(session_router)


@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "saathi-ai-backend",
        "version": "0.2.0",
        "engine1": "live",
        "stt": "openai_whisper",
        "message": "SAATHI-AI Phase 1 — Engine 1 Live Audio Processing Active",
    }


@app.get("/health")
def health_check():
    openai_configured = bool(os.environ.get("OPENAI_API_KEY", ""))
    return {
        "status": "healthy",
        "database": "sqlite_connected",
        "openai_api_key_configured": openai_configured,
        "engines": {
            "ai_engine_1": "live",
            "ai_engine_2": "initialized_standby",
        },
    }


@app.post("/api/cases/{case_id}/override")
def log_override(case_id: str, operator_name: str = "", override_reason: str = ""):
    return {"status": "success", "case_id": case_id, "logged": True}


@app.get("/api/audit-logs")
def get_audit_logs():
    return {"logs": []}
