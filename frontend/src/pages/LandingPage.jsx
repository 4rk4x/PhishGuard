import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  Cpu,
  Lock,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Database,
  SlidersHorizontal
} from 'lucide-react';
import { DemoUrlPills } from '../components/DemoUrlPills';

export const LandingPage = () => {
  const [quickUrl, setQuickUrl] = useState('');
  const navigate = useNavigate();

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    navigate(`/scanner?url=${encodeURIComponent(quickUrl.trim())}`);
  };

  return (
    <div className="space-y-24 py-10 cyber-grid-bg">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-surface border border-electric/30 text-xs font-mono text-electric mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Academic CSE Semester Capstone Project • 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-offwhite tracking-tight max-w-4xl mx-auto leading-tight">
          Explainable Machine Learning For <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-emerald-400">
            Phishing URL Detection
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-navy-muted max-w-2xl mx-auto leading-relaxed">
          PhishGuard combines 20 academic lexical and structural indicators with Random Forest classification,
          delivering transparent, explainable reasoning behind every security verdict.
        </p>

        {/* Live Interactive Quick Scanner Bar */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form onSubmit={handleQuickScan} className="relative flex items-center shadow-card">
            <div className="absolute left-4 text-electric">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter suspect URL to analyze (e.g. http://192.168.1.100/paypal/login.php)..."
              className="w-full pl-12 pr-36 py-4 bg-navy-surface border border-navy-border hover:border-navy-border/80 focus:border-electric rounded-xl text-offwhite font-mono text-sm placeholder:text-navy-muted outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-electric hover:bg-electric-hover text-navy font-bold text-sm rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Scan Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo URL Pills */}
          <div className="text-left">
            <DemoUrlPills onSelectUrl={(u) => setQuickUrl(u)} />
          </div>
        </div>

        {/* Quick CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/scanner"
            className="px-6 py-3 bg-electric hover:bg-electric-hover text-navy font-bold rounded-xl transition shadow-cyber flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            <span>Launch Full Scanner</span>
          </Link>
          <Link
            to="/docs"
            className="px-6 py-3 bg-navy-surface hover:bg-navy-card border border-navy-border text-offwhite font-medium rounded-xl transition flex items-center gap-2"
          >
            <Layers className="w-5 h-5 text-electric" />
            <span>Review Academic SRS & Docs</span>
          </Link>
        </div>
      </section>

      {/* Model Benchmark Performance Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-navy-surface/90 border border-navy-border rounded-2xl shadow-card">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-electric">Empirical Machine Learning Benchmarks</span>
            <h2 className="text-xl font-bold text-offwhite mt-1">Evaluated on Tranco & PhishTank Provenance Datasets</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
              <div className="text-3xl font-extrabold font-mono text-electric">96.25%</div>
              <div className="text-xs text-navy-muted font-mono mt-1">Test Accuracy</div>
              <div className="text-[10px] text-navy-muted/70 mt-0.5">Stratified Holdout Split</div>
            </div>
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
              <div className="text-3xl font-extrabold font-mono text-offwhite">96.64%</div>
              <div className="text-xs text-navy-muted font-mono mt-1">Precision</div>
              <div className="text-[10px] text-navy-muted/70 mt-0.5">Minimal False Alarms</div>
            </div>
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
              <div className="text-3xl font-extrabold font-mono text-offwhite">95.83%</div>
              <div className="text-xs text-navy-muted font-mono mt-1">Recall Rate</div>
              <div className="text-[10px] text-navy-muted/70 mt-0.5">True Phishing Catch</div>
            </div>
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
              <div className="text-3xl font-extrabold font-mono text-electric">0.9880</div>
              <div className="text-xs text-navy-muted font-mono mt-1">ROC-AUC Area</div>
              <div className="text-[10px] text-navy-muted/70 mt-0.5">High Discriminative Power</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-electric">Architectural Workflow</span>
          <h2 className="text-3xl font-extrabold text-offwhite mt-2">How PhishGuard Inspects URLs</h2>
          <p className="mt-3 text-sm text-navy-muted">
            End-to-end zero-execution pipeline designed to prevent accidental malware infection while explaining prediction weights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-navy-surface border border-navy-border rounded-xl relative group hover:border-electric/40 transition">
            <div className="w-10 h-10 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-electric mb-4 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-offwhite mb-2">URL Normalization</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Input URLs are defanged and parsed without making HTTP requests, eliminating client-side drive-by download risks.
            </p>
          </div>

          <div className="p-6 bg-navy-surface border border-navy-border rounded-xl relative group hover:border-electric/40 transition">
            <div className="w-10 h-10 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-electric mb-4 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-offwhite mb-2">20-Feature Extraction</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Extracts Shannon character entropy, IP presence, subdomain depth, keyword triggers, and shortening redirections.
            </p>
          </div>

          <div className="p-6 bg-navy-surface border border-navy-border rounded-xl relative group hover:border-electric/40 transition">
            <div className="w-10 h-10 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-electric mb-4 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-offwhite mb-2">Ensemble Classification</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Evaluates the vector against trained Random Forest (100 estimators) and calibrated Logistic Regression baselines.
            </p>
          </div>

          <div className="p-6 bg-navy-surface border border-navy-border rounded-xl relative group hover:border-electric/40 transition">
            <div className="w-10 h-10 rounded-lg bg-navy-card border border-navy-border flex items-center justify-center text-electric mb-4 font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-offwhite mb-2">Explainable AI Breakdown</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Deconstructs individual feature contributions, highlighting precisely which signals drove the risk score.
            </p>
          </div>
        </div>
      </section>

      {/* Key Project Modules & Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-electric">Core Modules</span>
          <h2 className="text-3xl font-extrabold text-offwhite mt-2">Comprehensive Security & ML Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-electric/10 text-electric border border-electric/30 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-offwhite mb-2">Explainable Detection (XAI)</h3>
            <p className="text-sm text-navy-muted leading-relaxed">
              Unlike black-box models, PhishGuard exposes the exact rationale behind each prediction, mapping features against safe baselines.
            </p>
          </div>

          <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-electric/10 text-electric border border-electric/30 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-offwhite mb-2">Zero-Execution Sandbox</h3>
            <p className="text-sm text-navy-muted leading-relaxed">
              Strictly non-intrusive lexical heuristic analysis. URLs are never loaded into browser iframes or pre-fetched over the wire.
            </p>
          </div>

          <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-electric/10 text-electric border border-electric/30 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-offwhite mb-2">Comparative ML Evaluation</h3>
            <p className="text-sm text-navy-muted leading-relaxed">
              Live confusion matrix, ROC curves, and cross-comparison between Logistic Regression and Random Forest models.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-10 rounded-2xl bg-gradient-to-r from-navy-surface to-navy-card border border-electric/30 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-offwhite mb-3">
            Ready for Faculty Demonstration?
          </h2>
          <p className="text-navy-muted text-sm max-w-xl mx-auto mb-6">
            Log in with student credentials or as the Lead Auditor Admin to inspect real-time threat telemetry, retraining pipelines, and audit logs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/scanner"
              className="px-6 py-3 bg-electric hover:bg-electric-hover text-navy font-bold rounded-xl transition shadow-cyber"
            >
              Open URL Scanner
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-navy-dark hover:bg-navy-card border border-navy-border text-offwhite font-medium rounded-xl transition"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

