import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export const FeatureCard = ({ item }) => {
  const {
    feature_name,
    value,
    baseline_threshold,
    status,
    impact_level,
    score_contribution,
    explanation
  } = item;

  let badgeBg = 'bg-electric/10 border-electric/30 text-electric';
  let Icon = CheckCircle2;
  let impactColor = 'text-electric';

  if (status === 'PHISHING' || impact_level === 'Critical' || impact_level === 'High') {
    badgeBg = 'bg-red-500/10 border-red-500/30 text-red-400';
    Icon = AlertOctagon;
    impactColor = 'text-red-400';
  } else if (status === 'SUSPICIOUS' || impact_level === 'Moderate') {
    badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    Icon = AlertTriangle;
    impactColor = 'text-amber-400';
  }

  const isPositiveContribution = score_contribution > 0;

  return (
    <div className="bg-navy-surface border border-navy-border hover:border-navy-border/80 rounded-xl p-4 transition flex flex-col justify-between">
      <div>
        {/* Header with feature name & status pill */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 shrink-0 ${impactColor}`} />
            <h4 className="text-sm font-semibold text-offwhite tracking-tight">{feature_name}</h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeBg}`}>
            {status}
          </span>
        </div>

        {/* Value vs Baseline */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-navy-card/80 rounded-lg text-xs font-mono">
          <div>
            <div className="text-navy-muted text-[10px] uppercase">Detected Value</div>
            <div className="text-offwhite font-medium truncate mt-0.5">{String(value)}</div>
          </div>
          <div>
            <div className="text-navy-muted text-[10px] uppercase">Normal Baseline</div>
            <div className="text-navy-muted truncate mt-0.5">{baseline_threshold}</div>
          </div>
        </div>

        {/* Plain-English Cybersecurity Explanation */}
        <p className="text-xs text-navy-muted leading-relaxed mb-3">
          {explanation}
        </p>
      </div>

      {/* Footer with Impact Level & Feature Contribution */}
      <div className="pt-2.5 border-t border-navy-border/60 flex items-center justify-between text-xs font-mono">
        <span className="text-navy-muted">
          Threat Impact: <span className={`font-semibold ${impactColor}`}>{impact_level}</span>
        </span>
        <span className={`font-bold ${isPositiveContribution ? 'text-red-400' : 'text-electric'}`}>
          {isPositiveContribution ? `+${score_contribution}%` : `${score_contribution}%`}
        </span>
      </div>
    </div>
  );
};

