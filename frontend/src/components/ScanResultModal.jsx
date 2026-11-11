import React from 'react';
import { X, Shield, Calendar, Globe, Cpu, CheckCircle } from 'lucide-react';
import { RiskGauge } from './RiskGauge';
import { FeatureCard } from './FeatureCard';

export const ScanResultModal = ({ isOpen, onClose, scan }) => {
  if (!isOpen || !scan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy border border-navy-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-navy/95 backdrop-blur-md px-6 py-4 border-b border-navy-border flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-surface border border-electric/30 flex items-center justify-center text-electric">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-offwhite">Scan Audit Report #{scan.id}</h3>
              <p className="text-xs text-navy-muted font-mono">Explainable AI Deep Inspection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-muted hover:text-offwhite hover:bg-navy-surface transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <RiskGauge
                score={scan.risk_score}
                confidence={scan.confidence}
                classification={scan.classification}
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 bg-navy-surface rounded-xl border border-navy-border">
                <div className="text-xs text-navy-muted uppercase font-mono mb-1">Defanged URL (Safe Representation)</div>
                <div className="font-mono text-sm text-electric break-all select-all p-2 bg-navy-card rounded border border-navy-border/60">
                  {scan.defanged_url || scan.url}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-navy-surface rounded-lg border border-navy-border">
                  <div className="text-navy-muted flex items-center gap-1.5 mb-1">
                    <Globe className="w-3.5 h-3.5 text-electric" /> Target Domain
                  </div>
                  <div className="text-offwhite font-bold truncate">{scan.domain || 'N/A'}</div>
                </div>
                <div className="p-3 bg-navy-surface rounded-lg border border-navy-border">
                  <div className="text-navy-muted flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-electric" /> Audit Timestamp
                  </div>
                  <div className="text-offwhite truncate">{new Date(scan.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-3 bg-navy-surface/80 rounded-lg border border-navy-border text-xs leading-relaxed">
                <span className="font-bold text-offwhite">Security Verdict: </span>
                <span className="text-navy-muted">{scan.security_verdict || scan.recommendation || 'Analysis completed.'}</span>
              </div>
            </div>
          </div>

          {/* Explainable AI Heuristics Grid */}
          <div>
            <h4 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-electric" />
              <span>Feature Contribution Analysis (XAI Reasons)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scan.explanations && scan.explanations.length > 0 ? (
                scan.explanations.map((exp, idx) => (
                  <FeatureCard key={idx} item={exp} />
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-navy-muted text-sm font-mono">
                  No individual feature breakdown available for this legacy record.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-navy/95 backdrop-blur-md px-6 py-3 border-t border-navy-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-navy-surface hover:bg-navy-card border border-navy-border text-offwhite rounded-lg transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

