import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scanAPI } from '../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Globe,
  Search,
  Activity,
  History,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ScanResultModal } from '../components/ScanResultModal';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData] = await Promise.all([
        scanAPI.getStats(),
        scanAPI.getHistory({ page: 1, pageSize: 6 }),
      ]);
      setStats(statsData);
      setRecentScans(historyData.items || []);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenScanModal = async (scanItem) => {
    try {
      const detailed = await scanAPI.getScanById(scanItem.id);
      setSelectedScan(detailed);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setSelectedScan(scanItem);
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy-border border-t-electric rounded-full animate-spin"></div>
        <p className="mt-4 text-navy-muted font-mono text-sm">Aggregating telemetry & ML intelligence...</p>
      </div>
    );
  }

  const threatData = stats?.threat_distribution || [
    { name: 'Safe URLs', value: 0, color: '#27D17F' },
    { name: 'Suspicious', value: 0, color: '#F59E0B' },
    { name: 'Phishing', value: 0, color: '#EF4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-offwhite">Security Intelligence Overview</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-electric/10 text-electric border border-electric/30">
              Active Session
            </span>
          </div>
          <p className="text-xs text-navy-muted font-mono mt-1">
            Logged in as <span className="text-offwhite font-bold">{user?.full_name}</span> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/scanner"
            className="px-4 py-2 bg-electric hover:bg-electric-hover text-navy text-sm font-bold rounded-lg transition shadow-cyber flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Scan New URL</span>
          </Link>
          <Link
            to="/history"
            className="px-4 py-2 bg-navy-card hover:bg-navy-dark border border-navy-border text-offwhite text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            <History className="w-4 h-4 text-electric" />
            <span>Audit History</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Total Scanned</span>
            <Activity className="w-4 h-4 text-electric" />
          </div>
          <div className="text-2xl font-bold font-mono text-offwhite">{stats?.total_scans || 0}</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Ingested URLs</div>
        </div>

        {/* Safe URLs */}
        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Safe URLs</span>
            <ShieldCheck className="w-4 h-4 text-electric" />
          </div>
          <div className="text-2xl font-bold font-mono text-electric">{stats?.safe_scans || 0}</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Classified as Safe</div>
        </div>

        {/* Phishing Threats */}
        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Phishing URLs</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{stats?.phishing_scans || 0}</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Classified as Phishing</div>
        </div>

        {/* Threat Detection Rate */}
        <div className="p-5 bg-navy-surface border border-navy-border rounded-xl">
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-mono uppercase">Threat Ratio</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{stats?.threat_ratio_percent || 0}%</div>
          <div className="text-[11px] text-navy-muted font-mono mt-1">Avg Risk: {stats?.avg_risk_score || 0}/100</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 7-Day Activity Area Chart */}
        <div className="lg:col-span-2 p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-offwhite">7-Day Scanning Frequency</h3>
              <p className="text-xs text-navy-muted font-mono">Temporal distribution of URL investigations</p>
            </div>
            <span className="text-xs font-mono text-electric bg-electric/10 px-2 py-0.5 rounded border border-electric/30">
              Recent Activity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.daily_activity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27D17F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#27D17F" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#24344D" />
                <XAxis dataKey="date" stroke="#8192A9" fontSize={11} />
                <YAxis stroke="#8192A9" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#101827', borderColor: '#24344D', borderRadius: '8px', color: '#F8FAFC' }}
                  labelStyle={{ color: '#27D17F', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="total_scans" name="Total Scans" stroke="#27D17F" strokeWidth={2} fillOpacity={1} fill="url(#scansGrad)" />
                <Area type="monotone" dataKey="threats_detected" name="Threats Flagged" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#threatGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Distribution Donut Chart */}
        <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-offwhite">Threat Classification Ratio</h3>
            <p className="text-xs text-navy-muted font-mono">Categorical division of scanned endpoints</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#101827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#101827', borderColor: '#24344D', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-navy-border/60 text-center text-xs font-mono">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-electric mr-1"></span>
              <span className="text-navy-muted">Safe</span>
              <div className="text-offwhite font-bold">{stats?.safe_scans || 0}</div>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span>
              <span className="text-navy-muted">Suspicious</span>
              <div className="text-offwhite font-bold">{stats?.suspicious_scans || 0}</div>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1"></span>
              <span className="text-navy-muted">Phishing</span>
              <div className="text-offwhite font-bold">{stats?.phishing_scans || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Detected Indicators Bar Chart */}
      <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-offwhite">Frequent Suspicious Indicators</h3>
            <p className="text-xs text-navy-muted font-mono">Occurrences of structural heuristics across scans</p>
          </div>
          <span className="text-xs font-mono text-navy-muted">Heuristic Indicators</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats?.top_threat_indicators || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#24344D" horizontal={false} />
              <XAxis type="number" stroke="#8192A9" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="indicator" type="category" stroke="#8192A9" fontSize={11} width={180} />
              <Tooltip
                contentStyle={{ backgroundColor: '#101827', borderColor: '#24344D', borderRadius: '8px', color: '#F8FAFC' }}
              />
              <Bar dataKey="count" fill="#27D17F" radius={[0, 4, 4, 0]} name="Detections" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-6 bg-navy-surface border border-navy-border rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-offwhite">Recent Scanning Telemetry</h3>
            <p className="text-xs text-navy-muted font-mono">Recent URL scans stored in the database</p>
          </div>
          <Link to="/history" className="text-xs text-electric hover:underline font-mono">
            View All Scans →
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-12 text-navy-muted font-mono text-xs">
            No scans recorded yet. Use the URL Scanner to initiate detection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-navy-card text-navy-muted border-b border-navy-border uppercase">
                <tr>
                  <th className="py-3 px-4">Scanned URL</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Audit Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border/60">
                {recentScans.map((scan) => {
                  let pillClass = 'bg-electric/10 text-electric border-electric/30';
                  if (scan.classification === 'phishing') {
                    pillClass = 'bg-red-500/10 text-red-400 border-red-500/30';
                  } else if (scan.classification === 'suspicious') {
                    pillClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  }

                  return (
                    <tr key={scan.id} className="hover:bg-navy-card/50 transition">
                      <td className="py-3 px-4 font-mono text-offwhite max-w-xs truncate">
                        {scan.defanged_url || scan.url}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${pillClass}`}>
                          {scan.classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-offwhite">
                        {Math.round(scan.risk_score)}/100
                      </td>
                      <td className="py-3 px-4 text-navy-muted">
                        {Math.round(scan.confidence)}%
                      </td>
                      <td className="py-3 px-4 text-navy-muted">
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenScanModal(scan)}
                          className="px-2.5 py-1 bg-navy-card hover:bg-navy-dark border border-navy-border hover:border-electric text-offwhite text-[11px] rounded transition"
                        >
                          View Explanation
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Modal */}
      <ScanResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        scan={selectedScan}
      />
    </div>
  );
};

