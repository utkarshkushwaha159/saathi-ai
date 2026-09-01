"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Radio,
  Square,
  Sparkles,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Database,
  Volume2,
  Info,
  Globe,
} from "lucide-react";
import { SVIArcGauge } from "./SVIArcGauge";

interface IndicatorItem {
  category: string;
  ui_label: string;
  matched_phrase: string;
  evidence_snippet: string;
  weight: number;
  is_calming: boolean;
}

interface MetricBar {
  name: string;
  score: number;
}

interface CopilotData {
  suggested_question: string;
  communication_tip: string;
  source: string;
}

interface LiveSessionResult {
  session_id: string;
  final_svi: number;
  final_svi_label: string;
  full_transcript: string;
  chunk_count: number;
  metric_bars: MetricBar[];
  case_brief: string;
  brief_source: string;
  case_db_id?: number;
}

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
}

const TEST_SENTENCES = [
  {
    text: "Mujhe ek complaint register karni hai.",
    type: "neutral",
    label: "Intake / Neutral",
    expected: "Baseline intake (~10-15, LOW)",
  },
  {
    text: "Mujhe dhamki mil rahi hai.",
    type: "threat",
    label: "Threat Language",
    expected: "SVI escalates (~35-50, MODERATE)",
  },
  {
    text: "Mujhe bahut darr lag raha hai.",
    type: "fear",
    label: "Fear/Distress",
    expected: "Voice Tone & SVI rise (~55-70, HIGH)",
  },
  {
    text: "Woh abhi mere ghar ke bahar hai.",
    type: "proximity",
    label: "Immediate Safety",
    expected: "Proximity & Isolation peak (CRITICAL)",
  },
  {
    text: "Abhi main safe hoon, police aa gayi hai.",
    type: "calming",
    label: "Calming Signal",
    expected: "SVI drops actively (De-escalation)",
  },
];

export function LiveSessionView({
  onSessionComplete,
}: {
  onSessionComplete?: (caseBrief: string) => void;
}) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [operatorName] = useState("Operator 12 (North Dispatch)");
  const [district] = useState("Sant Kabir Nagar, UP");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi-IN");

  // Real-time State from Engine 1
  const [sviScore, setSviScore] = useState<number>(10);
  const [sviLabel, setSviLabel] = useState<"LOW" | "MODERATE" | "HIGH" | "CRITICAL">("LOW");
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [interimText, setInterimText] = useState<string>("");
  const [chunkCount, setChunkCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [indicators, setIndicators] = useState<IndicatorItem[]>([]);
  const [metricBars, setMetricBars] = useState<MetricBar[]>([
    { name: "Voice tone", score: 8 },
    { name: "Distress keywords", score: 5 },
    { name: "Speech pace", score: 12 },
    { name: "Isolation signal", score: 4 },
  ]);
  const [copilot, setCopilot] = useState<CopilotData>({
    suggested_question: "Kripya mujhe apni situation ke baare mein thoda aur bataiyein. Aap kahan hain abhi?",
    communication_tip: "Maintain a calm, reassuring tone. Let the caller speak without interruption.",
    source: "rule_based",
  });
  const [speechPaceLabel, setSpeechPaceLabel] = useState<string>("normal");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [micActive, setMicActive] = useState<boolean>(false);

  // Completed Session Modal State
  const [completedSummary, setCompletedSummary] = useState<LiveSessionResult | null>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const processedSegmentsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcriptEntries, interimText]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = useCallback(() => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setMicActive(false);
  }, []);

  // ── Step 1: Start Live Session ─────────────────────────────────────────────
  const startLiveSession = async () => {
    try {
      setStatusNotice(null);
      processedSegmentsRef.current.clear();

      // 1. Initialize session on backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${apiUrl}/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ operator_name: operatorName }),
      });

      if (!res.ok) throw new Error("Could not connect to backend server");
      const data = await res.json();
      const currentSessionId = data.session_id;

      setSessionId(currentSessionId);
      setTranscriptEntries([]);
      setInterimText("");
      setIndicators([]);
      setChunkCount(0);
      setCompletedSummary(null);

      // 2. Request browser microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      setMicActive(true);

      // 3. Start Browser Real-Time Speech Recognition (Chrome Web Speech API)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage; // hi-IN or en-IN

        recognition.onresult = (event: any) => {
          let currentInterim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptText = event.results[i][0].transcript.trim();
            if (event.results[i].isFinal) {
              if (transcriptText && !processedSegmentsRef.current.has(transcriptText)) {
                processedSegmentsRef.current.add(transcriptText);
                addFinalizedSegment(currentSessionId, transcriptText);
              }
            } else {
              currentInterim += " " + transcriptText;
            }
          }
          setInterimText(currentInterim.trim());
        };

        recognition.onerror = (event: any) => {
          if (event.error !== "no-speech") {
            console.warn("Speech recognition notice:", event.error);
          }
        };

        recognition.onend = () => {
          // Restart recognition if session is still marked active
          if (isSessionActive && recognitionRef.current) {
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      // 4. Also start audio chunk streaming (MediaRecorder) for backend Whisper
      try {
        let mimeType = "audio/webm;codecs=opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/webm";
        }

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = async (e) => {
          if (e.data && e.data.size > 200) {
            sendAudioChunk(currentSessionId, e.data);
          }
        };

        recorder.start();

        audioIntervalRef.current = setInterval(() => {
          if (recorder.state === "recording") {
            recorder.stop();
            recorder.start();
          }
        }, 4000);
      } catch (err) {
        console.warn("MediaRecorder fallback notice:", err);
      }

      setIsSessionActive(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setStatusNotice(
        "Microphone error: " + (err.message || "Permission denied. Please allow microphone access in your browser.")
      );
      stopAllMedia();
    }
  };

  // ── Step 2: Handle Finalized Text Segment ──────────────────────────────────
  const addFinalizedSegment = async (currentSessionId: string, segmentText: string) => {
    const newEntry: TranscriptEntry = {
      id: `${Date.now()}-${Math.random()}`,
      text: segmentText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      isFinal: true,
    };

    setTranscriptEntries((prev) => [...prev, newEntry]);
    setInterimText("");
    setIsProcessing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const formData = new FormData();
      formData.append("text", segmentText);
      formData.append("chunk_duration", "3.5");
      formData.append("stt_source", "live_speech");

      const res = await fetch(`${apiUrl}/sessions/${currentSessionId}/segment`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      applyEngineUpdate(data);
    } catch (err) {
      console.error("Error updating segment:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Step 3: Send Audio Chunk to Backend (Whisper API) ──────────────────────
  const sendAudioChunk = async (currentSessionId: string, audioBlob: Blob) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const formData = new FormData();
      formData.append("audio", audioBlob, "chunk.webm");
      formData.append("chunk_duration", "4.0");

      const res = await fetch(`${apiUrl}/sessions/${currentSessionId}/chunk`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.new_text && !processedSegmentsRef.current.has(data.new_text)) {
        processedSegmentsRef.current.add(data.new_text);
        setTranscriptEntries((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            text: data.new_text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            isFinal: true,
          },
        ]);
      }

      applyEngineUpdate(data);
    } catch (err) {
      console.error("Error sending audio chunk:", err);
    }
  };

  // Helper: Apply Engine 1 Results to State
  const applyEngineUpdate = (data: any) => {
    if (!data || data.error) {
      if (data?.error && !data.error.includes("not found")) {
        setStatusNotice(data.error);
      }
      return;
    }

    if (typeof data.svi === "number") setSviScore(data.svi);
    if (data.svi_label) setSviLabel(data.svi_label);
    if (data.chunk_index) setChunkCount(data.chunk_index);
    if (data.pace_label) setSpeechPaceLabel(data.pace_label);
    if (data.metric_bars) setMetricBars(data.metric_bars);
    if (data.copilot) setCopilot(data.copilot);
    if (data.indicators && data.indicators.length > 0) {
      setIndicators((prev) => [...prev, ...data.indicators]);
    }
    if (data.stt_error) {
      setStatusNotice(data.stt_error);
    } else {
      setStatusNotice(null);
    }
  };

  // ── Step 4: End Live Session ───────────────────────────────────────────────
  const endLiveSession = async () => {
    if (!sessionId) return;
    stopAllMedia();
    setIsSessionActive(false);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sessions/${sessionId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          operator_name: operatorName,
          district: district,
        }),
      });

      const summary: LiveSessionResult = await res.json();
      setCompletedSummary(summary);
      if (onSessionComplete && summary.case_brief) {
        onSessionComplete(summary.case_brief);
      }
    } catch (err) {
      console.error("Error ending session:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Session Control Bar */}
      <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
              isSessionActive
                ? "bg-[#FBE8E8] border-[#F2C2C2] text-[#D9383A] animate-pulse"
                : "bg-[#F1FBFA] border-[#D0F2EE] text-[#0E7C7B]"
            }`}
          >
            {isSessionActive ? <Radio className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1F2430]">
                Live Call Interaction (Engine 1)
              </h2>
              {isSessionActive && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FBE8E8] text-[#D9383A] border border-[#F2C2C2]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A] animate-ping" />
                  REAL-TIME MIC ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-[#66707A]">
              Live speech transcription, real-time SVI calculation, observable distress indicators & operator co-pilot
            </p>
          </div>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E8EAEE] bg-[#FAFAFB] text-xs">
            <Globe className="w-3.5 h-3.5 text-[#66707A]" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isSessionActive}
              className="bg-transparent text-xs font-medium text-[#1F2430] outline-none cursor-pointer"
            >
              <option value="hi-IN">Hindi + English (Hinglish)</option>
              <option value="en-IN">English (Indian Accent)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>

          {!isSessionActive ? (
            <button
              onClick={startLiveSession}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F2430] hover:bg-[#2B3242] text-[#FFFFFF] text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#0E7C7B]" />
              Start Live Session
            </button>
          ) : (
            <button
              onClick={endLiveSession}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9383A] hover:bg-[#B8282A] text-[#FFFFFF] text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Square className="w-4 h-4" />
              End Session & Save Case
            </button>
          )}
        </div>
      </div>

      {/* System Status / Error Notice */}
      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-[#FFF8E6] border border-[#F6E09E] text-xs text-[#A6650F] flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Main Grid: Left (SVI & Metrics) + Right (Live Transcript & Co-pilot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SVI Gauge & Contributing Factors (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radial SVI Gauge Card */}
          <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="saathi-eyebrow">Real-Time SVI Score</span>
              <span className="text-[11px] font-mono text-[#66707A]">
                Updates: {chunkCount}
              </span>
            </div>

            <div className="py-2">
              <SVIArcGauge score={sviScore} label={sviLabel} size={190} />
            </div>

            {/* SVI Level Label & Status */}
            <div className="w-full mt-2 pt-4 border-t border-[#E8EAEE] flex items-center justify-between text-xs">
              <span className="text-[#66707A]">Vulnerability Level:</span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full border ${
                  sviLabel === "CRITICAL"
                    ? "bg-[#FBE8E8] text-[#D9383A] border-[#F2C2C2]"
                    : sviLabel === "HIGH"
                    ? "bg-[#FFF8E6] text-[#A6650F] border-[#F6E09E]"
                    : sviLabel === "MODERATE"
                    ? "bg-[#F1FBFA] text-[#0E7C7B] border-[#D0F2EE]"
                    : "bg-[#EAF5ED] text-[#2F855A] border-[#C3E4CD]"
                }`}
              >
                {sviLabel} ({sviScore}/100)
              </span>
            </div>
          </div>

          {/* Contributing Factor Metric Bars */}
          <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1F2430]">
                Contributing Factors
              </h3>
              <span className="text-[10px] text-[#66707A] font-medium">
                Engine 1 Real-Time
              </span>
            </div>

            <div className="space-y-3.5">
              {metricBars.map((metric) => (
                <div key={metric.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#1F2430] flex items-center gap-1.5">
                      {metric.name}
                      {metric.name === "Speech pace" && (
                        <span
                          title="PROTOTYPE APPROXIMATION: Computed as words per chunk duration. Not acoustic prosody analysis."
                          className="cursor-help px-1 py-0.2 rounded text-[9px] bg-[#F4F5F7] text-[#66707A] border border-[#E8EAEE]"
                        >
                          Proxy ({speechPaceLabel})
                        </span>
                      )}
                    </span>
                    <span className="text-[#66707A] font-mono">{metric.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F5F7] rounded-full overflow-hidden border border-[#E8EAEE]/60">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        metric.score > 65
                          ? "bg-[#D9383A]"
                          : metric.score > 35
                          ? "bg-[#A6650F]"
                          : "bg-[#0E7C7B]"
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-[#66707A] leading-relaxed border-t border-[#E8EAEE]">
              * Note: SVI is a decision-support triage signal. All escalation actions require operator confirmation.
            </div>
          </div>

          {/* Quick Test Sentence Selector for Operator/Demo */}
          <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0E7C7B]" />
              <h3 className="text-xs font-bold text-[#1F2430]">
                Quick Test Phrases (Hindi / Hinglish / English)
              </h3>
            </div>
            <p className="text-[11px] text-[#66707A]">
              Speak these into your mic to test real-time transcription and SVI progression:
            </p>

            <div className="space-y-2">
              {TEST_SENTENCES.map((test, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-[#E8EAEE] bg-[#FAFAFB] text-xs hover:border-[#0E7C7B]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-[#1F2430]">
                      "{test.text}"
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        test.type === "calming"
                          ? "bg-[#EAF5ED] text-[#2F855A] border-[#C3E4CD]"
                          : test.type === "neutral"
                          ? "bg-[#F1FBFA] text-[#0E7C7B] border-[#D0F2EE]"
                          : "bg-[#FBE8E8] text-[#D9383A] border-[#F2C2C2]"
                      }`}
                    >
                      {test.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#66707A]">
                    Expected: {test.expected}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript + Detected Indicators + Operator Co-pilot (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operator Co-Pilot Panel */}
          <div className="rounded-2xl border border-[#D0F2EE] bg-[#F1FBFA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0E7C7B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E7C7B]">
                  Operator Co-Pilot Assistant
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#0E7C7B] border border-[#D0F2EE] font-medium">
                Live Dynamic Guidance
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D0F2EE]/80 space-y-1">
                <div className="text-[10px] font-semibold text-[#66707A] uppercase tracking-wider">
                  Suggested Next Question:
                </div>
                <div className="text-xs font-medium text-[#1F2430]">
                  "{copilot.suggested_question}"
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D0F2EE]/80 space-y-1">
                <div className="text-[10px] font-semibold text-[#66707A] uppercase tracking-wider">
                  Communication Tip:
                </div>
                <div className="text-xs text-[#1F2430]">
                  {copilot.communication_tip}
                </div>
              </div>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-6 shadow-sm flex flex-col h-[340px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAEE] mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#66707A]" />
                <h3 className="text-sm font-bold text-[#1F2430]">
                  Live Call Transcript
                </h3>
              </div>
              {isSessionActive && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#66707A]">
                  <span className="w-2 h-2 rounded-full bg-[#2F855A] animate-pulse" />
                  Streaming live speech
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 font-sans text-xs leading-relaxed text-[#1F2430]">
              {transcriptEntries.length > 0 || interimText ? (
                <div className="space-y-2.5">
                  {transcriptEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#66707A] uppercase">
                        <span>Caller</span>
                        <span className="font-normal font-mono text-[9px]">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#1F2430] font-normal">
                        "{entry.text}"
                      </p>
                    </div>
                  ))}

                  {/* Real-time Interim Captions */}
                  {interimText && (
                    <div className="p-3 rounded-xl bg-[#F1FBFA]/60 border border-[#D0F2EE] space-y-1 animate-pulse">
                      <div className="text-[10px] font-bold text-[#0E7C7B] uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0E7C7B]" />
                        Caller (Speaking...)
                      </div>
                      <p className="text-xs text-[#1F2430] italic">
                        "{interimText}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#66707A] p-6">
                  <Mic className="w-8 h-8 text-[#66707A]/40 mb-2" />
                  <p className="text-xs font-medium">No live transcript yet.</p>
                  <p className="text-[11px] text-[#66707A]/80 mt-1">
                    Click "Start Live Session" and speak into your microphone in Hindi or English to see real-time captions and SVI updates.
                  </p>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* Detected Observable Indicators Log */}
          <div className="rounded-2xl border border-[#E8EAEE] bg-[#FFFFFF] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#66707A]">
                Detected Observable Indicators ({indicators.length})
              </h3>
              <span className="text-[10px] text-[#66707A]">
                Rule-Based & Context-Aware
              </span>
            </div>

            {indicators.length === 0 ? (
              <div className="text-xs text-[#66707A] py-2">
                No distress indicators detected yet. Words like "dhamki", "darr", or "safe" will appear here with evidence snippets.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
                {indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
                      ind.is_calming
                        ? "bg-[#EAF5ED] text-[#2F855A] border-[#C3E4CD]"
                        : "bg-[#FBE8E8] text-[#D9383A] border-[#F2C2C2]"
                    }`}
                  >
                    <span className="font-semibold">"{ind.matched_phrase}"</span>
                    <span className="text-[10px] opacity-75">
                      ({ind.ui_label})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed Session Case Record Modal / Summary */}
      {completedSummary && (
        <div className="rounded-2xl border-2 border-[#2F855A]/40 bg-[#FFFFFF] p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2F855A]" />
              <h3 className="text-base font-bold text-[#1F2430]">
                Case Record Created & Saved to Database
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#EAF5ED] text-[#2F855A] border border-[#C3E4CD]">
              Session ID: {completedSummary.session_id}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-2">
            <div className="text-xs font-bold text-[#1F2430]">
              Generated Case Brief ({completedSummary.brief_source}):
            </div>
            <p className="text-xs text-[#1F2430] leading-relaxed">
              {completedSummary.case_brief}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-[#66707A] pt-2 border-t border-[#E8EAEE]">
            <div className="flex items-center gap-4">
              <span>Final SVI: <strong>{completedSummary.final_svi}/100 ({completedSummary.final_svi_label})</strong></span>
              <span>Audio Updates Processed: <strong>{completedSummary.chunk_count}</strong></span>
            </div>
            <button
              onClick={() => setCompletedSummary(null)}
              className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8EAEE] text-[#1F2430] font-medium hover:bg-[#F4F5F7] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
