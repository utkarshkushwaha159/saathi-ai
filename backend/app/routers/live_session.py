"""
SAATHI-AI Live Session Router
REST endpoints for Engine 1 live audio and speech streaming pipeline.
"""

import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.case_model import LiveCase
import app.ai_engine_1 as engine1
from app.ai_engine_1.session_manager import create_session

logger = logging.getLogger("router.live_session")
router = APIRouter(prefix="/api/sessions", tags=["Live Session"])


@router.post("/start")
def start_session(operator_name: str = Form(default="Operator")):
    """
    Create a new live session. Returns session_id for all subsequent streaming.
    """
    session_id = create_session(operator_name=operator_name)
    return {
        "session_id": session_id,
        "status": "started",
        "operator_name": operator_name,
        "message": "Session ready. Audio/Speech streaming active.",
    }


@router.post("/{session_id}/chunk")
async def receive_chunk(
    session_id: str,
    audio: UploadFile = File(...),
    chunk_duration: float = Form(default=3.5),
):
    """
    Receive a raw audio chunk, transcribe via OpenAI Whisper API, and update Engine 1.
    """
    audio_bytes = await audio.read()
    filename = audio.filename or "chunk.webm"
    audio_format = filename.rsplit(".", 1)[-1] if "." in filename else "webm"

    result = engine1.process_audio_chunk(
        session_id=session_id,
        audio_bytes=audio_bytes,
        audio_format=audio_format,
        chunk_duration_seconds=chunk_duration,
    )

    if "error" in result and "not found" in result.get("error", "").lower():
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.post("/{session_id}/segment")
def receive_text_segment(
    session_id: str,
    text: str = Form(...),
    chunk_duration: float = Form(default=3.5),
    stt_source: str = Form(default="live_speech"),
):
    """
    Receive an incremental finalized text segment directly from real-time speech stream.
    Updates observable indicators, SVI, metric breakdown, and co-pilot guidance.
    """
    result = engine1.process_text_segment(
        session_id=session_id,
        text=text,
        chunk_duration_seconds=chunk_duration,
        stt_source=stt_source,
    )

    if "error" in result and "not found" in result.get("error", "").lower():
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.post("/{session_id}/end")
def end_session(
    session_id: str,
    operator_name: str = Form(default="Operator"),
    district: str = Form(default=""),
    db: Session = Depends(get_db),
):
    """
    End a session: generate case brief, save Case record to SQLite, return summary.
    """
    result = engine1.end_session(
        session_id=session_id,
        operator_name=operator_name,
    )

    if "error" in result and "not found" in result.get("error", "").lower():
        raise HTTPException(status_code=404, detail=result["error"])

    # Save to database
    case_record = LiveCase(
        session_id=result["session_id"],
        operator_name=operator_name,
        district=district or None,
        final_svi=result["final_svi"],
        svi_label=result["final_svi_label"],
        full_transcript=result["full_transcript"],
        case_brief=result["case_brief"],
        brief_source=result.get("brief_source"),
        chunk_count=result["chunk_count"],
    )
    db.add(case_record)
    db.commit()
    db.refresh(case_record)

    return {
        **result,
        "case_db_id": case_record.id,
        "saved_to_db": True,
    }


@router.get("/cases")
def list_cases(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all saved live session case records."""
    cases = (
        db.query(LiveCase)
        .order_by(LiveCase.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return {
        "total": db.query(LiveCase).count(),
        "cases": [
            {
                "id": c.id,
                "session_id": c.session_id,
                "operator_name": c.operator_name,
                "district": c.district,
                "final_svi": c.final_svi,
                "svi_label": c.svi_label,
                "case_brief": c.case_brief,
                "chunk_count": c.chunk_count,
                "created_at": str(c.created_at),
            }
            for c in cases
        ],
    }
