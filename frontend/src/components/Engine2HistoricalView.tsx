"use client";

import React from "react";
import { CaseRecord } from "@/data/caseData";
import {
  History,
  Layers,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Engine2HistoricalViewProps {
  currentCase: CaseRecord;
}

export function Engine2HistoricalView({
  currentCase,
}: Engine2HistoricalViewProps) {
  const match = currentCase.historicalMatch;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="saathi-card p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8EAEE]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F1FBFA] border border-[#D0F2EE]">
              <History className="w-4 h-4 text-[#0E7C7B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1F2430]">
                  Engine 2: Historical Intelligence & Semantic Precedents
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1FBFA] text-[#0E7C7B] border border-[#D0F2EE]">
                  Active Engine
                </span>
              </div>
              <p className="text-xs text-[#66707A]">
                Evaluating Case {currentCase.caseNumber} against historical incident archives
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column Metric Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Semantic Match Precedent */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="saathi-eyebrow">Closest Precedent</span>
                {match && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F7EF] text-[#2F855A] border border-[#C7EBD7]">
                    {match.similarityScore}% Match
                  </span>
                )}
              </div>

              <h4 className="text-base font-semibold text-[#1F2430] mb-1">
                {match ? match.caseId : "No Prior Match"}
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                {match ? `${match.district} District (${match.year})` : "Standard queue"}
              </p>

              <p className="text-xs text-[#1F2430] leading-relaxed bg-[#F8F9FA] p-3 rounded-xl border border-[#E8EAEE]">
                {match?.resolution || "No precedent resolution available."}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
              <span>Vector Cosine Similarity</span>
              <span className="font-semibold text-[#0E7C7B]">High Confidence</span>
            </div>
          </div>

          {/* Box 2: Regional Cluster Pattern */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="saathi-eyebrow">Regional Pattern</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FBF1E1] text-[#A6650F] border border-[#F5E2C4]">
                  Cluster Active
                </span>
              </div>

              <h4 className="text-base font-semibold text-[#1F2430] mb-1">
                {currentCase.district} Cluster
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                Identified across last 14 days
              </p>

              <div className="space-y-2 text-xs text-[#1F2430]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA] border border-[#E8EAEE]">
                  <span>Repeated threat reports</span>
                  <strong className="text-[#B23A3A]">3 incidents</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA] border border-[#E8EAEE]">
                  <span>Average police dispatch time</span>
                  <strong className="text-[#1F2430]">6.4 mins</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
              <span>Spatial Density Index</span>
              <span className="font-semibold text-[#A6650F]">Elevated Alert</span>
            </div>
          </div>

          {/* Box 3: Delay-Risk Prediction */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8EAEE] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="saathi-eyebrow">Delay-Risk Prediction</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F7EF] text-[#2F855A] border border-[#C7EBD7]">
                  Low Risk ({currentCase.delayRiskScore}%)
                </span>
              </div>

              <h4 className="text-base font-semibold text-[#1F2430] mb-1">
                Resource Availability
              </h4>
              <p className="text-xs text-[#66707A] mb-3">
                {currentCase.district} Sector Dispatch Station
              </p>

              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAEE] space-y-1 text-xs text-[#1F2430]">
                <div className="flex items-center justify-between">
                  <span>Available PCR Units:</span>
                  <strong className="text-[#2F855A]">4 Active</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duty Supervisor:</span>
                  <strong className="text-[#1F2430]">Station Officer 02</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#8A8F98]">
              <span>Bottleneck Probability</span>
              <span className="font-semibold text-[#2F855A]">Minimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
