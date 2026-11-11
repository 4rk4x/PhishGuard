import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const RiskGauge = ({ score = 0, confidence = 0, classification = 'safe', size = 'default' }) => {
  // Determine color and status
  let statusColor = '#27D17F'; // Electric green
  let statusBg = 'bg-electric/10';
  let statusBorder = 'border-electric/30';
  let statusText = 'text-electric';
  let StatusIcon = ShieldCheck;
  let statusLabel = 'SAFE';

  if (classification === 'phishing' || score >= 70) {
    statusColor = '#EF4444'; // Red
    statusBg = 'bg-red-500/10';
    statusBorder = 'border-red-500/30';
    statusText = 'text-red-400';
    StatusIcon = ShieldAlert;
    statusLabel = 'PHISHING';
  } else if (classification === 'suspicious' || score >= 40) {
    statusColor = '#F59E0B'; // Amber
    statusBg = 'bg-amber-500/10';
    statusBorder = 'border-amber-500/30';
    statusText = 'text-amber-400';
    StatusIcon = AlertTriangle;
    statusLabel = 'SUSPICIOUS';
  }

  // Calculate SVG arc parameters
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Use semi-circle or 240 deg arc
  const arcPercentage = 0.75; // 270 degree arc
  const totalLength = circumference * arcPercentage;
  const offset = totalLength - (Math.min(100, Math.max(0, score)) / 100) * totalLength;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-navy-card rounded-2xl border border-navy-border shadow-card">
      <div className="relative flex items-center justify-center">
        {/* SVG Circular Meter */}
        <svg className="w-44 h-44 transform -rotate-135">
          {/* Background circle track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#152033"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={totalLength}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={statusColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={totalLength}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-offwhite tracking-tight">
            {Math.round(score)}
            <span className="text-xl text-navy-muted">/100</span>
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-navy-muted mt-0.5">
            Threat Risk Score
          </span>
        </div>
      </div>

      {/* Classification Pill */}
      <div className={`mt-4 px-4 py-1.5 rounded-full border ${statusBorder} ${statusBg} ${statusText} flex items-center gap-2 font-mono text-sm font-bold tracking-wider`}>
        <StatusIcon className="w-4 h-4" />
        <span>{statusLabel}</span>
      </div>

      {/* Model Confidence Bar */}
      <div className="w-full mt-5 pt-4 border-t border-navy-border/60 flex items-center justify-between text-xs font-mono">
        <span className="text-navy-muted">Model Confidence:</span>
        <span className="text-offwhite font-bold">{confidence}%</span>
      </div>
    </div>
  );
};

