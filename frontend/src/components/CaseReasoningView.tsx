"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Info,
  Clock,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CaseRecord } from "@/data/caseData";
import { SVIArcGauge } from "@/components/SVIArcGauge";
import { TranscriptModal } from "@/components/TranscriptModal";

interface CaseReasoningViewProps {
  currentCase: CaseRecord;
  onBack?: () => void;
  onSelectCase?: (caseId: string) => void;
  allCases?: CaseRecord[];
}

export function CaseReasoningView({
  currentCase,
  onBack,
  onSelectCase,
  allCases = [],
}: CaseReasoningViewProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [overrideNote, setOverrideNote] = useState("");
  const [overrideSaved, setOverrideSaved] = useState(false);

  // Status pill styling
  const getPillStyle = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-[#FCEEEE] text-[#B23A3A] border-[#F8D7D7]";
      case "warning":
        return "bg-[#FBF1E1] text-[#A6650F] border-[#F5E2C4]";
      case "low":
      default:
        return "bg-[#E9F7EF] text-[#2F855A] border-[#C7EBD7]";
    }
  };

  const handleEscalate = () => {
    setIsEscalated(true);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideNote.trim()) return;
    setOverrideSaved(true);
    setTimeout(() => {
      setShowOverrideInput(false);
      setOverrideSaved(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Outer Container Card */}
      <div className="saathi-card p-6 md:p-8">
        {/* Header matching exact reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EAEE]">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg text-[#66707A] hover:text-[#1F2430] hover:bg-[#F8F9FA] transition-colors"
                title="Back to triage queue"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-bold text-[#1F2430] tracking-tight">
              Case {currentCase.caseNumber}
            </h2>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getPillStyle(
                currentCase.status
              )}`}
            >
              {currentCase.statusLabel}
            </span>
          </div>

          <div className="text-sm text-[#66707A]">
            <span>District: </span>
            <strong className="text-[#1F2430] font-semibold">
              {currentCase.district}
            </strong>
          </div>
        </div>

        {/* Two-Column Grid matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Left Column: Why this case was flagged critical */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="saathi-eyebrow">
                  why this case was flagged {currentCase.statusLabel}
                </span>
                <span className="text-xs font-medium text-[#0E7C7B] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Engine 1 Inferences
                </span>
              </div>

              {/* Metric Breakdown Bars */}
              <div className="space-y-3.5">
                {currentCase.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1F2430]">
                        {metric.name}
                      </span>
                      <span
                        className="font-semibold tabular-nums"
                        style={{ color: metric.color }}
                      >
                        {metric.score}%
                      </span>
                    </div>

                    {/* Metric Bar Track */}
                    <div className="w-full h-2 rounded-full bg-[#E8EAEE] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${metric.score}%`,
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detected Keywords Callout Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-2">
                <p className="text-xs text-[#1F2430] leading-relaxed">
                  <strong className="font-semibold text-[#1F2430]">
                    Detected keywords:{" "}
                  </strong>
                  {currentCase.detectedKeywords.map((kw, i) => (
                    <span key={i} className="text-[#1F2430]">
                      &quot;{kw}&quot;
                      {i < currentCase.detectedKeywords.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  . Flagged by the operator co-pilot at {currentCase.flaggedTime}.
                </p>
              </div>
            </div>

            {/* AI Explanation Disclaimer (Mandatory Safety Principle) */}
            <div className="pt-3 border-t border-[#E8EAEE] flex items-start gap-2 text-xs text-[#8A8F98]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#8A8F98]" />
              <p className="leading-relaxed">
                These signals informed the score. The escalation decision was
                made by the operator, not the AI.
              </p>
            </div>
          </div>

          {/* Right Column: Case Brief, Timeline & Actions */}
          <div className="flex flex-col justify-between space-y-6 lg:border-l lg:border-[#E8EAEE] lg:pl-8">
            <div className="space-y-6">
              {/* Case Brief */}
              <div>
                <span className="saathi-eyebrow block mb-2">case brief</span>
                <p className="text-[13.5px] text-[#1F2430] leading-relaxed bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E8EAEE]">
                  {currentCase.caseBrief}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <span className="saathi-eyebrow block mb-3">timeline</span>
                <div className="space-y-2.5">
                  {currentCase.timeline.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-[#1F2430]"
                    >
                      <span className="font-mono font-semibold text-[#66707A] shrink-0 w-12">
                        {event.timestamp} —
                      </span>
                      <span className="leading-relaxed text-[#1F2430]">
                        {event.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operator Actions Area */}
            <div className="space-y-3 pt-4 border-t border-[#E8EAEE]">
              {/* View Full Transcript Button */}
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="w-full saathi-btn-secondary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#66707A]" />
                <span>View full transcript</span>
              </button>

              {/* Primary Action Button (Max ONE dark solid button per screen) */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleEscalate}
                  disabled={isEscalated}
                  className={`w-full saathi-btn-primary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 ${
                    isEscalated ? "opacity-75 cursor-default bg-[#2F855A]" : ""
                  }`}
                >
                  {isEscalated ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                      <span>Dispatch Confirmed • PCR Unit En Route</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
                      <span>Escalate to District Police Dispatch</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowOverrideInput(!showOverrideInput)}
                  className="w-full sm:w-auto shrink-0 saathi-btn-secondary py-2.5 px-3 text-xs text-[#66707A]"
                  title="Record manual supervisor override note"
                >
                  Override Note
                </button>
              </div>

              {/* Human Override Logging Box */}
              {showOverrideInput && (
                <form
                  onSubmit={handleSaveOverride}
                  className="mt-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[#1F2430] font-medium">
                    <span>Supervisor Override Justification</span>
                    <span className="text-[#8A8F98]">Audit Log #AL-4471</span>
                  </div>
                  <input
                    type="text"
                    value={overrideNote}
                    onChange={(e) => setOverrideNote(e.target.value)}
                    placeholder="Enter reason for modifying AI priority or triage status..."
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E8EAEE] rounded-lg text-xs text-[#1F2430] focus:outline-none focus:border-[#0E7C7B]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOverrideInput(false)}
                      className="px-2.5 py-1 text-xs text-[#66707A] hover:text-[#1F2430]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#1F2430] text-[#FFFFFF] rounded-lg text-xs font-medium"
                    >
                      {overrideSaved ? "Saved to Audit Log!" : "Save Override"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case Switcher & SVI Quick Context Bar */}
      {allCases.length > 1 && (
        <div className="saathi-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#66707A]">
            <span className="saathi-eyebrow">Select Active Case:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {allCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCase && onSelectCase(c.id)}
                  className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
                    c.id === currentCase.id
                      ? "bg-[#1F2430] text-[#FFFFFF] border-[#1F2430]"
                      : "bg-[#FFFFFF] text-[#66707A] border-[#E8EAEE] hover:bg-[#F8F9FA]"
                  }`}
                >
                  {c.caseNumber} ({c.district})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#8A8F98]">
            <span>Active Operator: </span>
            <strong className="text-[#1F2430]">{currentCase.operatorName}</strong>
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        caseNumber={currentCase.caseNumber}
        district={currentCase.district}
        transcript={currentCase.transcript}
      />
    </div>
  );
}
