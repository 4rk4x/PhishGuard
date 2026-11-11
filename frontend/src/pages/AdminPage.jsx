import React, { useState, useEffect } from 'react';
import { adminAPI, mlAPI } from '../services/api';
import {
  ShieldAlert,
  Users,
  Database,
  Cpu,
  RefreshCw,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Table,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [ovData, usersData, mlData] = await Promise.all([
        adminAPI.getOverview(),
        adminAPI.getUsers(),
        mlAPI.getMetrics(),
      ]);
      setOverview(ovData);
      setUsers(usersData);
      setMetrics(mlData);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRetrain = async () => {
    if (!window.confirm('Initiate model retraining on the synthetic benchmark dataset? This will update persistent model artifacts.')) return;
    setRetraining(true);
    setRetrainSuccess('');
    try {
      const res = await adminAPI.retrainModel();
      setRetrainSuccess(`Retraining completed on synthetic benchmark. RF test accuracy: ${(res.rf_accuracy * 100).toFixed(2)}%; LR test accuracy: ${(res.lr_accuracy * 100).toFixed(2)}%`);
      // Refresh metrics
      const freshMetrics = await mlAPI.getMetrics();
      setMetrics(freshMetrics);
      const freshOverview = await adminAPI.getOverview();
      setOverview(freshOverview);
    } catch (err) {
      console.error(err);
      alert('Retraining failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy-border border-t-electric rounded-full animate-spin"></div>
        <p className="mt-4 text-navy-muted font-mono text-sm">Querying Administrative Core & Scikit-Learn Model Telemetry...</p>
      </div>
    );
  }

  const rfMetrics = metrics?.comparison?.random_forest || {};
  const lrMetrics = metrics?.comparison?.logistic_regression || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              Administrative Scope
            </span>
            <span className="text-xs font-mono text-navy-muted">•</span>
            <span className="text-xs font-mono text-navy-muted">Faculty Examiner View</span>
          </div>
          <h1 className="text-2xl font-bold text-offwhite mt-1">Lead Security Auditor & Model Governance</h1>
          <p className="text-xs text-navy-muted font-mono mt-0.5">
            System health, model cross-evaluation, dataset provenance, and retrain automation
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="px-5 py-2.5 bg-electric hover:bg-electric-hover disabled:opacity-50 text-navy font-bold text-xs font-mono rounded-lg transition shadow-cyber flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Retraining Models...' : 'Trigger Pipeline Retrain'}</span>
        </button>
      </div>

      {retrainSuccess && (
        <div className="p-4 bg-electric/10 border border-electric/40 rounded-xl text-xs font-mono text-electric flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{retrainSuccess}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Registered Accounts</span>
            <Users className="w-4 h-4 text-electric" />
          </div>
          <div className="text-2xl font-bold font-mono text-offwhite">{overview?.total_users || 0}</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Registered Accounts</div>
        </div>

        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Global Scans</span>
            <Activity className="w-4 h-4 text-electric" />
          </div>
          <div className="text-2xl font-bold font-mono text-offwhite">{overview?.total_scans || 0}</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">System-wide Queries</div>
        </div>

        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Threat Rate</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{overview?.threat_detection_rate || 0}%</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Phishing + Suspicious</div>
        </div>

        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Synthetic Test Accuracy</span>
            <Cpu className="w-4 h-4 text-electric" />
          </div>
          <div className="text-2xl font-bold font-mono text-electric">{overview?.model_accuracy || 0}%</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Random Forest on synthetic benchmark</div>
        </div>
      </div>

      {/* Model Performance Comparison Section */}
      <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-navy-border/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-offwhite flex items-center gap-2">
              <Sliders className="w-5 h-5 text-electric" />
              <span>Model Comparison on Synthetic Holdout Test Set</span>
            </h3>
            <p className="text-xs text-navy-muted font-mono mt-0.5">
              Performance comparison of Random Forest and Logistic Regression on project-generated synthetic data
            </p>
          </div>
          <div className="text-xs font-mono text-navy-muted">
            Synthetic data evaluation split: <span className="text-offwhite font-bold">80% Train / 20% Test</span>
          </div>
        </div>

        {/* Comparison Metric Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-card text-navy-muted border-b border-navy-border uppercase">
              <tr>
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4 text-electric font-bold">Random Forest (Primary Model)</th>
                <th className="py-3 px-4 text-offwhite">Logistic Regression (Linear Baseline)</th>
                <th className="py-3 px-4 text-navy-muted">Delta / Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-border/60">
              <tr>
                <td className="py-3 px-4 font-bold text-offwhite">Classification Accuracy</td>
                <td className="py-3 px-4 font-bold text-electric">{(rfMetrics.accuracy * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 font-medium text-offwhite">{(lrMetrics.accuracy * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-electric font-bold">+{((rfMetrics.accuracy - lrMetrics.accuracy) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-offwhite">Precision (Positive Predictive Value)</td>
                <td className="py-3 px-4 font-bold text-electric">{(rfMetrics.precision * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 font-medium text-offwhite">{(lrMetrics.precision * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-electric font-bold">+{((rfMetrics.precision - lrMetrics.precision) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-offwhite">Recall (Sensitivity / True Positive Rate)</td>
                <td className="py-3 px-4 font-bold text-electric">{(rfMetrics.recall * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 font-medium text-offwhite">{(lrMetrics.recall * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-electric font-bold">+{((rfMetrics.recall - lrMetrics.recall) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-offwhite">F1-Score (Harmonic Mean)</td>
                <td className="py-3 px-4 font-bold text-electric">{(rfMetrics.f1_score * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 font-medium text-offwhite">{(lrMetrics.f1_score * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-electric font-bold">+{((rfMetrics.f1_score - lrMetrics.f1_score) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-offwhite">ROC-AUC Area Under Curve</td>
                <td className="py-3 px-4 font-bold text-electric">{rfMetrics.roc_auc?.toFixed(4)}</td>
                <td className="py-3 px-4 font-medium text-offwhite">{lrMetrics.roc_auc?.toFixed(4)}</td>
                <td className="py-3 px-4 text-electric font-bold">+{(rfMetrics.roc_auc - lrMetrics.roc_auc).toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Confusion Matrices Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Random Forest Matrix */}
          <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
            <div className="text-xs font-mono font-bold text-electric mb-3 flex items-center justify-between">
              <span>Random Forest Confusion Matrix</span>
              <span className="text-[10px] text-navy-muted">Synthetic holdout N={metrics?.testing_samples ?? '?'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 bg-navy-surface rounded border border-electric/30">
                <div className="text-lg font-bold text-electric">
                  {rfMetrics.confusion_matrix?.[0]?.[0] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">True Negative (Benign)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-red-500/30">
                <div className="text-lg font-bold text-red-400">
                  {rfMetrics.confusion_matrix?.[0]?.[1] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">False Positive (Type I)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-amber-500/30">
                <div className="text-lg font-bold text-amber-400">
                  {rfMetrics.confusion_matrix?.[1]?.[0] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">False Negative (Type II)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-electric/30">
                <div className="text-lg font-bold text-electric">
                  {rfMetrics.confusion_matrix?.[1]?.[1] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">True Positive (Phishing)</div>
              </div>
            </div>
          </div>

          {/* Logistic Regression Matrix */}
          <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60">
            <div className="text-xs font-mono font-bold text-offwhite mb-3 flex items-center justify-between">
              <span>Logistic Regression Confusion Matrix</span>
              <span className="text-[10px] text-navy-muted">Synthetic holdout N={metrics?.testing_samples ?? '?'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 bg-navy-surface rounded border border-navy-border">
                <div className="text-lg font-bold text-offwhite">
                  {lrMetrics.confusion_matrix?.[0]?.[0] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">True Negative (Benign)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-red-500/30">
                <div className="text-lg font-bold text-red-400">
                  {lrMetrics.confusion_matrix?.[0]?.[1] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">False Positive (Type I)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-amber-500/30">
                <div className="text-lg font-bold text-amber-400">
                  {lrMetrics.confusion_matrix?.[1]?.[0] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">False Negative (Type II)</div>
              </div>
              <div className="p-3 bg-navy-surface rounded border border-navy-border">
                <div className="text-lg font-bold text-offwhite">
                  {lrMetrics.confusion_matrix?.[1]?.[1] ?? '?'}
                </div>
                <div className="text-[10px] text-navy-muted uppercase mt-0.5">True Positive (Phishing)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Provenance Box */}
        <div className="p-4 bg-navy-card rounded-xl border border-navy-border/60 text-xs font-mono">
          <div className="text-offwhite font-bold mb-1">Synthetic Benchmark Provenance & Citation:</div>
          <div className="text-navy-muted leading-relaxed">
            {metrics?.dataset_citation}
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-navy-muted">
            <span>Total Dataset Samples: <strong className="text-offwhite">{metrics?.total_samples}</strong></span>
            <span>Training Split: <strong className="text-offwhite">{metrics?.training_samples}</strong></span>
            <span>Testing Split: <strong className="text-offwhite">{metrics?.testing_samples}</strong></span>
            <span>Licensing: <strong className="text-electric">{metrics?.dataset_license}</strong></span>
          </div>
        </div>
      </div>

      {/* Feature Importance Ranking Chart */}
      <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-offwhite">Random Forest Feature Importance (MDI Gini)</h3>
            <p className="text-xs text-navy-muted font-mono">Relative feature importance within the trained Random Forest model</p>
          </div>
          <span className="text-xs font-mono text-electric">Top Discriminators</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics?.feature_importances || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#24344D" horizontal={false} />
              <XAxis type="number" stroke="#8192A9" fontSize={11} unit="%" />
              <YAxis dataKey="feature" type="category" stroke="#8192A9" fontSize={11} width={170} />
              <Tooltip
                contentStyle={{ backgroundColor: '#101827', borderColor: '#24344D', borderRadius: '8px', color: '#F8FAFC' }}
                formatter={(val) => [`${val}%`, 'Gini Importance']}
              />
              <Bar dataKey="percentage" fill="#27D17F" radius={[0, 4, 4, 0]} name="Gini Importance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-offwhite">Registered User Accounts</h3>
            <p className="text-xs text-navy-muted font-mono">Registered accounts and individual scan volume</p>
          </div>
          <span className="text-xs font-mono text-navy-muted">{users.length} Accounts Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-card text-navy-muted border-b border-navy-border uppercase">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Scans Executed</th>
                <th className="py-3 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-border/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy-card/50 transition">
                  <td className="py-3 px-4 text-navy-muted">#{u.id}</td>
                  <td className="py-3 px-4 font-bold text-offwhite">{u.full_name}</td>
                  <td className="py-3 px-4 text-navy-muted">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-electric/10 text-electric border-electric/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-offwhite">{u.total_scans}</td>
                  <td className="py-3 px-4 text-navy-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

