"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Headphones,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  UserCheck,
  Layers,
  History,
  Sparkles,
  Mic,
} from "lucide-react";
import { SYNTHETIC_CASES, CaseRecord } from "@/data/caseData";
import { CaseReasoningView } from "@/components/CaseReasoningView";
import { Engine2HistoricalView } from "@/components/Engine2HistoricalView";
import { LiveSessionView } from "@/components/LiveSessionView";
import { SVIArcGauge } from "@/components/SVIArcGauge";

type ActiveTab = "live_session" | "reasoning" | "triage_queue" | "engine2";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("live_session");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-4471");
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  const currentCase =
    SYNTHETIC_CASES.find((c) => c.id === selectedCaseId) || SYNTHETIC_CASES[0];

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then((data) => {
        setBackendStatus(
          data.status === "healthy" ? "Online (Engine 1 Live)" : "Degraded"
        );
        setIsBackendHealthy(data.status === "healthy");
      })
      .catch(() => {
        setBackendStatus("Standby (Ready to connect)");
        setIsBackendHealthy(false);
      });
  }, []);

  const handleSelectCaseFromQueue = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab("reasoning");
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] p-4 sm:p-8 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8EAEE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="saathi-eyebrow">SIH26093 • Decision Support Platform</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1FBFA] text-[#0E7C7B] border border-[#D0F2EE]">
              Engine 1 Live
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1F2430] tracking-tight">
            SAATHI-AI Operator Workstation
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#FFFFFF] border border-[#E8EAEE] text-xs">
            <button
              onClick={() => setActiveTab("live_session")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "live_session"
                  ? "bg-[#1F2430] text-[#FFFFFF]"
                  : "text-[#66707A] hover:text-[#1F2430]"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#0E7C7B]" />
              Start Live Session
            </button>
            <button
              onClick={() => setActiveTab("reasoning")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "reasoning"
                  ? "bg-[#1F2430] text-[#FFFFFF]"
                  : "text-[#66707A] hover:text-[#1F2430]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Reasoning Breakdown
            </button>
            <button
              onClick={() => setActiveTab("triage_queue")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "triage_queue"
                  ? "bg-[#1F2430] text-[#FFFFFF]"
                  : "text-[#66707A] hover:text-[#1F2430]"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Triage Queue
            </button>
            <button
              onClick={() => setActiveTab("engine2")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "engine2"
                  ? "bg-[#1F2430] text-[#FFFFFF]"
                  : "text-[#66707A] hover:text-[#1F2430]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Engine 2 Precedents
            </button>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8EAEE] text-xs text-[#66707A]">
            <div
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy ? "bg-[#2F855A]" : "bg-[#A6650F]"
              }`}
            />
            <span>
              Backend:{" "}
              <strong className="text-[#1F2430]">{backendStatus}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main Interactive Views */}
      {activeTab === "live_session" && (
        <LiveSessionView />
      )}

      {activeTab === "reasoning" && (
        <CaseReasoningView
          currentCase={currentCase}
          allCases={SYNTHETIC_CASES}
          onSelectCase={(id) => setSelectedCaseId(id)}
          onBack={() => setActiveTab("triage_queue")}
        />
      )}

      {activeTab === "triage_queue" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F2430]">
                Active Triage Queue
              </h2>
              <p className="text-xs text-[#66707A]">
                Click any case to open its explainable AI reasoning breakdown
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1FBFA] text-[#0E7C7B] border border-[#D0F2EE]">
              {SYNTHETIC_CASES.length} Active Intakes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SYNTHETIC_CASES.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectCaseFromQueue(item.id)}
                className={`saathi-card p-5 cursor-pointer hover:border-[#0E7C7B] transition-all flex flex-col justify-between space-y-4 ${
                  item.id === selectedCaseId ? "ring-2 ring-[#0E7C7B]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#1F2430]">
                      {item.caseNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === "critical"
                          ? "bg-[#FCEEEE] text-[#B23A3A] border-[#F8D7D7]"
                          : item.status === "warning"
                          ? "bg-[#FBF1E1] text-[#A6650F] border-[#F5E2C4]"
                          : "bg-[#E9F7EF] text-[#2F855A] border-[#C7EBD7]"
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#1F2430] mb-1">
                    {item.district}
                  </h3>
                  <p className="text-xs text-[#66707A] line-clamp-2 mb-4">
                    {item.caseBrief}
                  </p>

                  {/* SVI Semi-Circle Arc Gauge */}
                  <div className="py-1">
                    <SVIArcGauge score={item.sviScore} size={120} showLabel={false} />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8EAEE] flex items-center justify-between text-xs text-[#0E7C7B] font-medium">
                  <span>View AI Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "engine2" && (
        <Engine2HistoricalView currentCase={currentCase} />
      )}

      {/* Standard Footer */}
      <footer className="saathi-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#66707A]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0E7C7B]" />
          <span>
            SAATHI-AI • Explainable Decision Support Engine • Human Oversight Mandatory
          </span>
        </div>
        <div className="text-[#8A8F98]">
          Synthetic data only • No real PII • Strict design tokens applied
        </div>
      </footer>
    </main>
  );
}
