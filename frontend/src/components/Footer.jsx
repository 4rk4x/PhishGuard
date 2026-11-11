import React from 'react';
import { Shield, ExternalLink, Github, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-navy-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: System info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-navy-surface border border-electric/40 flex items-center justify-center text-electric">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-offwhite">Phish<span className="text-electric">Guard</span></span>
            </div>
            <p className="text-sm text-navy-muted max-w-md mb-4 leading-relaxed">
              Explainable Machine Learning-Based Phishing URL Detection System.
              Combines 20 academic lexical and structural heuristic indicators with Random Forest classification and transparent XAI reasoning.
            </p>
            <div className="text-xs text-navy-muted font-mono flex items-center gap-4">
              <span>Department of Computer Science & Engineering</span>
              <span>•</span>
              <span>CSE Semester Capstone Project</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-3">Modules</h4>
            <ul className="space-y-2 text-sm text-navy-muted">
              <li><Link to="/scanner" className="hover:text-electric transition">URL Scanner</Link></li>
              <li><Link to="/dashboard" className="hover:text-electric transition">Threat Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-electric transition">Audit History</Link></li>
              <li><Link to="/docs" className="hover:text-electric transition">System Specifications & SRS</Link></li>
            </ul>
          </div>

          {/* Col 3: Academic provenance & citation */}
          <div>
            <h4 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-3">Benchmark Citation</h4>
            <div className="p-3 bg-navy-surface border border-navy-border rounded-lg text-xs font-mono text-navy-muted leading-relaxed">
              Tranco Top-1M (NDSS '19) & PhishTank / Mendeley Phishing Benchmark Repository. CC BY 4.0 License.
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-navy-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-electric animate-pulse"></span>
              <span>Zero-execution sandbox active</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-muted">
          <div>© {new Date().getFullYear()} PhishGuard CSE Capstone Research. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 font-mono text-[11px]">Designed with Deep Navy #101827 & Electric Green #27D17F</div>
        </div>
      </div>
    </footer>
  );
};

