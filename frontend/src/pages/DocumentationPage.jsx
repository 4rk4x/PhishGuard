import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Cpu,
  Database,
  Shield,
  CheckCircle2,
  Terminal,
  BookOpen,
  GitBranch
} from 'lucide-react';

export const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Project Overview & SRS', icon: FileText },
    { id: 'architecture', name: 'System Architecture', icon: Layers },
    { id: 'ml', name: 'ML Methodology & Features', icon: Cpu },
    { id: 'database', name: 'Database ER Design', icon: Database },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-navy-muted mb-1">
          <span>PhishGuard</span>
          <span>/</span>
          <span className="text-electric">Academic Specifications</span>
        </div>
        <h1 className="text-2xl font-bold text-offwhite flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-electric" />
          <span>CSE Semester Capstone Documentation</span>
        </h1>
        <p className="text-xs text-navy-muted font-mono mt-1">
          Software requirements specification, architecture, ML heuristic formulas, and database schemas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-border pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap ${isActive
                  ? 'bg-electric text-navy font-bold'
                  : 'bg-navy-surface text-navy-muted hover:text-offwhite border border-navy-border'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & SRS */}
      {activeTab === 'overview' && (
        <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-navy-muted">
          <div className="border-b border-navy-border/60 pb-4">
            <h2 className="text-xl font-bold text-offwhite">Software Requirements Specification (SRS) Summary</h2>
            <p className="text-xs font-mono text-electric mt-1">IEEE 830-1998 Standard Compliance</p>
          </div>

          <div className="space-y-4 leading-relaxed">
            <h3 className="text-base font-bold text-offwhite">1. Introduction & Problem Statement</h3>
            <p>
              Phishing continues to represent over 80% of reported cybersecurity incidents according to the FBI Internet Crime Report.
              Traditional blacklist mechanisms (DNSBL, Google Safe Browsing) suffer from significant detection latency (averaging 4 to 24 hours),
              rendering them incapable of mitigating targeted zero-day phishing campaigns.
              PhishGuard addresses this vulnerability by deploying an explainable machine learning classifier operating directly on lexical URL features,
              eliminating the requirement to resolve or execute malicious endpoints.
            </p>

            <h3 className="text-base font-bold text-offwhite mt-6">2. Functional Requirements (FR)</h3>
            <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs">
              <li><strong className="text-offwhite">FR-1 (URL Ingestion & Defanging):</strong> Sanitize user-submitted URLs and generate defanged representations (e.g. hxxps[://]...).</li>
              <li><strong className="text-offwhite">FR-2 (Feature Vector Extraction):</strong> Compute 20 lexical, syntactic, and entropy features in under 50 milliseconds.</li>
              <li><strong className="text-offwhite">FR-3 (Machine Learning Inference):</strong> Execute Random Forest classification producing calibrated risk score (0-100) and confidence.</li>
              <li><strong className="text-offwhite">FR-4 (Explainable AI Engine):</strong> Generate human-readable attribution breakdown explaining how each heuristic contributed to the score.</li>
              <li><strong className="text-offwhite">FR-5 (Audit History Registry):</strong> Store scans with timestamps in SQLite, supporting pagination and status filtering.</li>
              <li><strong className="text-offwhite">FR-6 (Role-Based Access Control):</strong> Secure endpoints with JWT authentication separating researcher users from lead auditors.</li>
            </ul>

            <h3 className="text-base font-bold text-offwhite mt-6">3. Non-Functional Requirements (NFR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-navy-card rounded-lg border border-navy-border">
                <div className="text-electric font-bold mb-1">Performance (NFR-1)</div>
                <div>Sub-100ms end-to-end inference latency on standard commodity hardware.</div>
              </div>
              <div className="p-3 bg-navy-card rounded-lg border border-navy-border">
                <div className="text-electric font-bold mb-1">Security (NFR-2)</div>
                <div>Strict zero-execution policy. Scanned URLs are never pre-fetched or executed.</div>
              </div>
              <div className="p-3 bg-navy-card rounded-lg border border-navy-border">
                <div className="text-electric font-bold mb-1">Availability (NFR-3)</div>
                <div>Lightweight embedded SQLite + FastAPI stack with minimal external dependencies.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-navy-muted">
          <div className="border-b border-navy-border/60 pb-4">
            <h2 className="text-xl font-bold text-offwhite">System Architecture & Pipeline Flow</h2>
            <p className="text-xs font-mono text-electric mt-1">Multi-Tier Microservice Client-Server Model</p>
          </div>

          <div className="p-6 bg-navy-card rounded-xl border border-navy-border font-mono text-xs space-y-4">
            <div className="text-offwhite font-bold mb-2">Architectural Layer Decomposition:</div>

            <div className="p-3 bg-navy-surface rounded border border-navy-border/80">
              <div className="text-electric font-bold mb-1">1. Presentation Tier (React 18 + Vite + Tailwind CSS)</div>
              <div>Single Page Application (SPA) providing real-time URL submission, interactive Recharts telemetry, and responsive XAI inspection cards.</div>
            </div>

            <div className="p-3 bg-navy-surface rounded border border-navy-border/80">
              <div className="text-electric font-bold mb-1">2. API & Security Service Tier (FastAPI + JWT + Bcrypt)</div>
              <div>Asynchronous REST endpoints managing authentication, defanging sanitization, rate limiting, and telemetry aggregation.</div>
            </div>

            <div className="p-3 bg-navy-surface rounded border border-navy-border/80">
              <div className="text-electric font-bold mb-1">3. Machine Learning & XAI Engine Tier (Scikit-Learn + Joblib)</div>
              <div>Non-intrusive 20-feature heuristic extractor, Standard Scaler transformation, and Random Forest 100-estimator ensemble.</div>
            </div>

            <div className="p-3 bg-navy-surface rounded border border-navy-border/80">
              <div className="text-electric font-bold mb-1">4. Persistence Tier (SQLite + SQLAlchemy ORM)</div>
              <div>ACID-compliant relational database storing user credentials with bcrypt hashes and scan audit records.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ML Methodology & Features */}
      {activeTab === 'ml' && (
        <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-navy-muted">
          <div className="border-b border-navy-border/60 pb-4">
            <h2 className="text-xl font-bold text-offwhite">Machine Learning Feature Engineering & Mathematics</h2>
            <p className="text-xs font-mono text-electric mt-1">Mathematical formulations of extracted heuristic indicators</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border space-y-2">
              <div className="text-offwhite font-bold flex items-center justify-between font-mono">
                <span>1. Shannon Character Entropy (Domain Randomness)</span>
                <span className="text-electric text-xs">Indicator: Algorithmic Domain Generation (DGA)</span>
              </div>
              <p className="text-xs leading-relaxed">
                Measures the uncertainty and information density in domain characters. Phishing toolkits often generate random domain names (e.g. x829df83af.top) yielding entropy above 4.2 bits.
              </p>
              <div className="p-2.5 bg-navy-surface rounded font-mono text-xs text-electric">
                H(X) = - ∑ p(x_i) * log_2(p(x_i))
              </div>
            </div>

            <div className="p-4 bg-navy-card rounded-xl border border-navy-border space-y-2">
              <div className="text-offwhite font-bold flex items-center justify-between font-mono">
                <span>2. Subdomain Nesting Depth</span>
                <span className="text-electric text-xs">Indicator: Brand Masquerading</span>
              </div>
              <p className="text-xs leading-relaxed">
                Legitimate domains rarely exceed 1 subdomain tier (e.g. docs.domain.com). Phishers embed trusted brand names as subdomains (e.g. paypal.com.account-update.xyz).
              </p>
              <div className="p-2.5 bg-navy-surface rounded font-mono text-xs text-electric">
                SubdomainDepth = max(0, Count(dots in domain) - 1)
              </div>
            </div>

            <div className="p-4 bg-navy-card rounded-xl border border-navy-border space-y-2">
              <div className="text-offwhite font-bold flex items-center justify-between font-mono">
                <span>3. Direct IPv4 / IPv6 Address Usage</span>
                <span className="text-electric text-xs">Indicator: Reputation Bypass</span>
              </div>
              <p className="text-xs leading-relaxed">
                Binary indicator evaluating whether the host contains raw IP addresses (e.g. http://192.168.1.100/login) rather than registered FQDNs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Database ER Design */}
      {activeTab === 'database' && (
        <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-navy-muted">
          <div className="border-b border-navy-border/60 pb-4">
            <h2 className="text-xl font-bold text-offwhite">Relational Database Entity-Relationship Design</h2>
            <p className="text-xs font-mono text-electric mt-1">SQLite 3 Schemas & Foreign Key Constraints</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Users Table */}
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border space-y-2">
              <div className="text-offwhite font-bold text-sm mb-2 flex items-center justify-between">
                <span>Entity: USERS</span>
                <span className="text-electric text-[10px]">Primary Entity</span>
              </div>
              <div className="space-y-1.5 text-navy-muted">
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite font-bold">id (PK)</span>
                  <span>INTEGER PRIMARY KEY AUTOINCREMENT</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">email</span>
                  <span>VARCHAR(255) UNIQUE NOT NULL</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">full_name</span>
                  <span>VARCHAR(255) NOT NULL</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">hashed_password</span>
                  <span>VARCHAR(255) NOT NULL (Bcrypt)</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">role</span>
                  <span>VARCHAR(50) DEFAULT 'user'</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offwhite">created_at</span>
                  <span>DATETIME UTC</span>
                </div>
              </div>
            </div>

            {/* Scans Table */}
            <div className="p-4 bg-navy-card rounded-xl border border-navy-border space-y-2">
              <div className="text-offwhite font-bold text-sm mb-2 flex items-center justify-between">
                <span>Entity: SCANS</span>
                <span className="text-electric text-[10px]">FK -&gt; users.id</span>
              </div>
              <div className="space-y-1.5 text-navy-muted">
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite font-bold">id (PK)</span>
                  <span>INTEGER PRIMARY KEY AUTOINCREMENT</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">user_id (FK)</span>
                  <span>INTEGER NULLABLE ON DELETE SET NULL</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">defanged_url</span>
                  <span>TEXT NOT NULL</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">classification</span>
                  <span>VARCHAR(50) NOT NULL</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">risk_score</span>
                  <span>FLOAT (0.0 to 100.0)</span>
                </div>
                <div className="flex justify-between border-b border-navy-border/60 pb-1">
                  <span className="text-offwhite">explanation</span>
                  <span>TEXT (JSON XAI Factors)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offwhite">created_at</span>
                  <span>DATETIME UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

