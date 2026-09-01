"""
Engine 1: In-Memory Session State Manager

Manages active live session states. Each session has an SVIState that persists
across all audio chunks received during that session.

Phase 1: In-memory dict. Session state is lost on server restart — acceptable for demo.
Future phase: Replace with Redis or DB-backed session store without changing the API.
"""

import time
import uuid
from typing import Dict, Optional
from .svi_engine import SVIState

# In-memory session store: session_id → SVIState
_sessions: Dict[str, SVIState] = {}
_session_meta: Dict[str, dict] = {}


def create_session(operator_name: str = "Operator") -> str:
    """Create a new live session and return the session_id."""
    session_id = str(uuid.uuid4())[:8]
    _sessions[session_id] = SVIState(session_id=session_id)
    _session_meta[session_id] = {
        "operator_name": operator_name,
        "started_at": time.time(),
        "chunk_count": 0,
    }
    return session_id


def get_session(session_id: str) -> Optional[SVIState]:
    """Retrieve session state, or None if not found."""
    return _sessions.get(session_id)


def update_session(session_id: str, state: SVIState) -> None:
    """Save updated session state."""
    _sessions[session_id] = state
    if session_id in _session_meta:
        _session_meta[session_id]["chunk_count"] = state.chunk_count


def get_session_meta(session_id: str) -> Optional[dict]:
    return _session_meta.get(session_id)


def close_session(session_id: str) -> Optional[SVIState]:
    """Remove session from memory and return final state."""
    state = _sessions.pop(session_id, None)
    _session_meta.pop(session_id, None)
    return state
