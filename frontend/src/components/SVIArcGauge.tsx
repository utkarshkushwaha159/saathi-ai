"use client";

import React from "react";

interface SVIArcGaugeProps {
  score: number; // 0 to 100
  size?: number; // width in px
  showLabel?: boolean;
  label?: string;
}

export function SVIArcGauge({
  score,
  size = 140,
  showLabel = true,
  label,
}: SVIArcGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine color and status label based on strict design system
  let color = "#2F855A"; // Low / Success
  let statusText = label || "Low Stress";
  let statusBg = "#E9F7EF";

  if (clampedScore > 70) {
    color = "#B23A3A"; // Critical / Danger
    statusText = label || "Critical Distress";
    statusBg = "#FCEEEE";
  } else if (clampedScore > 35) {
    color = "#A6650F"; // Medium / Warning
    statusText = label || "Moderate Urgency";
    statusBg = "#FBF1E1";
  }

  // Semi-circle arc parameters
  const strokeWidth = 10;
  const radius = 50;
  const cx = 60;
  const cy = 60;

  // Arc length for semi-circle (pi * r)
  const arcLength = Math.PI * radius;
  const progressLength = (clampedScore / 100) * arcLength;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size * 0.65 }}
      >
        <svg
          viewBox="0 0 120 70"
          className="w-full h-full overflow-visible"
        >
          {/* Background Arc (180 degrees semi-circle) */}
          <path
            d="M 10,60 A 50,50 0 0,1 110,60"
            fill="none"
            stroke="#E8EAEE"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d="M 10,60 A 50,50 0 0,1 110,60"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${arcLength}`}
            style={{
              transition: "stroke-dasharray 0.4s ease, stroke 0.4s ease",
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 top-3 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#1F2430" }}
          >
            {clampedScore}
          </span>
          <span
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: "#8A8F98" }}
          >
            SVI / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div
          className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
          style={{
            backgroundColor: statusBg,
            color: color,
            borderColor: `${color}30`,
          }}
        >
          {statusText}
        </div>
      )}
    </div>
  );
}
