import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scanAPI } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { FeatureCard } from '../components/FeatureCard';
import { DemoUrlPills } from '../components/DemoUrlPills';
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ClipboardPaste,
  CheckCircle2,
  Lock,
  Globe,
  Cpu,
  Layers,
  Terminal,
  AlertCircle
} from 'lucide-react';

export const ScannerPage = () => {
  const [searchParams] = useSearchParams();
  const [urlInput, setUrlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showRawFeatures, setShowRawFeatures] = useState(false);

  // Auto-scan if URL parameter provided in query string
  useEffect(() => {
    const queryUrl = searchParams.get('url');
    if (queryUrl) {
      setUrlInput(queryUrl);
      executeScan(queryUrl);
    }
  }, [searchParams]);

  const validateUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return 'URL input cannot be empty.';
    if (/\s/.test(trimmed)) return 'URL cannot contain whitespace characters.';
    return null;
  };

  const executeScan = async (targetUrl) => {
    const validationError = validateUrl(targetUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setScanning(true);
    setResult(null);

    try {
      const data = await scanAPI.analyze(targetUrl.trim());
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to complete URL analysis. Ensure backend is running.');
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeScan(urlInput);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read failed or permission denied:', err);
    }
  };

  const handleReset = () => {
    setUrlInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-navy-muted mb-1">
          <span>PhishGuard Security Intelligence</span>
          <span>/</span>
          <span className="text-electric">Explainable URL Scanner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-offwhite tracking-tight">
          Machine Learning Phishing Detection Engine
        </h1>
        <p className="text-sm text-navy-muted mt-1 max-w-2xl">
          Zero-execution heuristic parser with Random Forest classification. Inspects 20 lexical, syntactic, and structural signals.
        </p>
      </div>

      {/* URL Input Form Card */}
      <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-3.5 text-navy-muted">
                <Globe className="w-5 h-5 text-electric" />
              </div>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter suspect URL (e.g. http://192.168.1.100/paypal/login.php or https://domain.com)..."
                className="w-full pl-12 pr-24 py-3.5 bg-navy-card border border-navy-border focus:border-electric rounded-xl text-offwhite font-mono text-sm placeholder:text-navy-muted outline-none transition"
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="p-1.5 text-navy-muted hover:text-offwhite hover:bg-navy-surface rounded transition"
                >
                  <ClipboardPaste className="w-4 h-4" />
                </button>
                {urlInput && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Clear input"
                    className="p-1.5 text-navy-muted hover:text-offwhite hover:bg-navy-surface rounded transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="px-8 py-3.5 bg-electric hover:bg-electric-hover disabled:opacity-50 text-navy font-bold rounded-xl text-sm transition shadow-cyber flex items-center justify-center gap-2 shrink-0"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                  <span>Extracting Features...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze URL</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo URLs */}
          <DemoUrlPills onSelectUrl={(u) => { setUrlInput(u); executeScan(u); }} />
        </form>
      </div>

      {/* Loading Scanning Radar Animation */}
      {scanning && (
        <div className="p-12 bg-navy-surface border border-navy-border rounded-2xl text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-electric/40 animate-ping"></div>
            <div className="w-16 h-16 rounded-full bg-electric/10 border border-electric flex items-center justify-center text-electric">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-offwhite">Running Heuristic & Ensemble Pipeline</h3>
            <p className="text-xs text-navy-muted font-mono mt-1">
              Parsing 20 lexical features • Computing Shannon Character Entropy • Random Forest Inference...
            </p>
          </div>
        </div>
      )}

      {/* Detection Results & Explainable AI Section */}
      {result && !scanning && (
        <div className="space-y-6">
          {/* Top Result Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Gauge Card */}
            <div className="lg:col-span-1">
              <RiskGauge
                score={result.risk_score}
                confidence={result.confidence}
                classification={result.classification}
              />
            </div>

            {/* Verdict & Safe Defanged Details Card */}
            <div className="lg:col-span-2 p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-navy-muted">
                    <Shield className="w-4 h-4 text-electric" />
                    <span>Scan Audit Record #{result.id || 'LIVE'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-navy-muted">
                    Model: {result.model_used}
                  </span>
                </div>

                {/* Safe Defanged URL display */}
                <div className="mb-4">
                  <div className="text-[11px] font-mono text-navy-muted uppercase mb-1 flex items-center justify-between">
                    <span>Defanged URL (Safe Representation - Non-executable)</span>
                    <span className="text-electric">Zero-Execution Safe</span>
                  </div>
                  <div className="p-3 bg-navy-card rounded-lg border border-navy-border font-mono text-sm text-electric break-all select-all">
                    {result.defanged_url}
                  </div>
                </div>

                {/* Verdict and Guidance */}
                <div className="p-4 rounded-xl border border-navy-border bg-navy-card/60 space-y-2">
                  <div className="text-xs font-mono uppercase text-navy-muted">Academic Security Verdict</div>
                  <div className="text-base font-bold text-offwhite">{result.security_verdict}</div>
                  <p className="text-xs text-navy-muted leading-relaxed">{result.recommendation}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-4 border-t border-navy-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-navy-muted">Target Domain: <span className="text-offwhite font-bold">{result.domain}</span></span>
                <button
                  type="button"
                  onClick={() => setShowRawFeatures(!showRawFeatures)}
                  className="text-electric hover:underline flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showRawFeatures ? 'Hide Raw Feature Vector' : 'View Raw Feature Vector'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Raw Feature Vector Table (Collapsible for Professor Viva Inspection) */}
          {showRawFeatures && (
            <div className="p-6 bg-navy-card border border-navy-border rounded-2xl font-mono text-xs">
              <div className="flex items-center justify-between mb-3 text-offwhite font-bold">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-electric" />
                  <span>Raw Numerical Feature Vector Extracted for Scikit-Learn Model</span>
                </span>
                <span className="text-navy-muted text-[11px]">20 Numerical Dimensions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-surface p-4 rounded-xl border border-navy-border/60">
                {Object.entries(result.features).map(([k, v]) => (
                  <div key={k} className="p-2 bg-navy-dark/60 rounded border border-navy-border/40">
                    <div className="text-[10px] text-navy-muted uppercase truncate">{k}</div>
                    <div className="text-xs font-bold text-electric truncate mt-0.5">{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explainable AI (XAI) Reasons Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-offwhite flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-electric" />
                  <span>Explainable AI Detection Reasons (XAI)</span>
                </h3>
                <p className="text-xs text-navy-muted font-mono mt-0.5">
                  Detailed attribution showing how individual URL heuristics influenced the final risk score
                </p>
              </div>
              <span className="text-xs font-mono bg-navy-surface text-navy-muted px-3 py-1 rounded-lg border border-navy-border">
                {result.explanations?.length || 0} Factors Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.explanations?.map((item, idx) => (
                <FeatureCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

