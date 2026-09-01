"use client";

import React from "react";
import { X, FileText, Bot, User, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { TranscriptUtterance } from "@/data/caseData";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber: string;
  district: string;
  transcript: TranscriptUtterance[];
}

export function TranscriptModal({
  isOpen,
  onClose,
  caseNumber,
  district,
  transcript,
}: TranscriptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="saathi-card w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#FFFFFF] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8EAEE]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F1FBFA] border border-[#D0F2EE]">
              <FileText className="w-4 h-4 text-[#0E7C7B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#1F2430]">
                  Call Transcript • Case {caseNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1FBFA] text-[#0E7C7B] border border-[#D0F2EE]">
                  Synchronized
                </span>
              </div>
              <p className="text-xs text-[#66707A]">
                District: {district} • Dual-channel audio stream analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#66707A] hover:text-[#1F2430] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transcript Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {transcript.map((item, idx) => {
            if (item.isAlert) {
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FCEEEE] border border-[#F8D7D7] flex items-start gap-3 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-[#B23A3A] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-[#B23A3A] mb-1">
                      <span>{item.speaker}</span>
                      <span className="font-mono text-[11px]">{item.time}</span>
                    </div>
                    <p className="text-[#1F2430] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            }

            const isCaller = item.speaker === "Caller";

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${
                  item.isFlagged
                    ? "bg-[#FBF1E1]/40 border-[#F5E2C4]"
                    : "bg-[#FFFFFF] border-[#E8EAEE]"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-[#1F2430]">
                    {isCaller ? (
                      <User className="w-3.5 h-3.5 text-[#66707A]" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0E7C7B]" />
                    )}
                    <span>{item.speaker}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8A8F98]">
                    {item.time}
                  </span>
                </div>

                <p className="text-[13.5px] text-[#1F2430] leading-relaxed">
                  {item.text}
                </p>

                {/* Keyphrase / Tone badges */}
                {(item.flaggedKeywords || item.toneMarker) && (
                  <div className="mt-2.5 pt-2 border-t border-[#E8EAEE] flex flex-wrap items-center gap-2 text-[11px]">
                    {item.flaggedKeywords && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#8A8F98]">Keywords:</span>
                        {item.flaggedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-[#FCEEEE] text-[#B23A3A] border border-[#F8D7D7] font-medium"
                          >
                            &quot;{kw}&quot;
                          </span>
                        ))}
                      </div>
                    )}
                    {item.toneMarker && (
                      <span className="px-2 py-0.5 rounded bg-[#F1FBFA] text-[#0E7C7B] border border-[#D0F2EE]">
                        {item.toneMarker}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98] bg-[#FFFFFF]">
          <span>Synthetic data demonstration • PII automatically redacted</span>
          <button
            onClick={onClose}
            className="saathi-btn-secondary px-4 py-1.5 text-xs"
          >
            Close Transcript
          </button>
        </div>
      </div>
    </div>
  );
}
