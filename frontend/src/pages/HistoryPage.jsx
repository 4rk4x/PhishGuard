import React, { useState, useEffect } from 'react';
import { scanAPI } from '../services/api';
import { ScanResultModal } from '../components/ScanResultModal';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Trash2,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const HistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await scanAPI.getHistory({
        page,
        pageSize,
        classification: classificationFilter,
        search: searchTerm
      });
      setScans(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to retrieve history logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, classificationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete scan record #${id} from the database?`)) return;
    try {
      await scanAPI.deleteScan(id);
      fetchHistory();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleOpenDetail = async (scanItem) => {
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

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phishguard_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-navy-muted mb-1">
            <span>PhishGuard</span>
            <span>/</span>
            <span className="text-electric">Telemetry Log</span>
          </div>
          <h1 className="text-2xl font-bold text-offwhite flex items-center gap-2">
            <History className="w-6 h-6 text-electric" />
            <span>Historical Scan Registry</span>
          </h1>
          <p className="text-xs text-navy-muted font-mono mt-1">
            Permanent SQLite audit log of scanned endpoints and model inferences
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          disabled={scans.length === 0}
          className="px-4 py-2 bg-navy-surface hover:bg-navy-card border border-navy-border hover:border-electric text-offwhite text-xs font-mono rounded-lg transition flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-electric" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-navy-surface border border-navy-border rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-navy-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain, URL or ID..."
            className="w-full pl-9 pr-16 py-2 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-xs font-mono text-offwhite outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-navy-surface hover:bg-navy-border text-xs font-mono text-electric rounded"
          >
            Search
          </button>
        </form>

        {/* Classification Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {['all', 'safe', 'suspicious', 'phishing'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setClassificationFilter(cat); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition ${
                classificationFilter === cat
                  ? 'bg-electric text-navy font-bold'
                  : 'bg-navy-card text-navy-muted hover:text-offwhite border border-navy-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-navy-surface border border-navy-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-navy-border border-t-electric rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-navy-muted font-mono">Querying database registry...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 bg-navy-card text-navy-muted rounded-full flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-offwhite">No Audit Records Match Query</h3>
            <p className="text-xs text-navy-muted max-w-sm mx-auto font-mono">
              Try resetting your filter parameters or scan new URLs via the scanner interface.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-navy-card text-navy-muted border-b border-navy-border uppercase">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Defanged Target URL</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border/60">
                {scans.map((item) => {
                  let pillClass = 'bg-electric/10 text-electric border-electric/30';
                  if (item.classification === 'phishing') {
                    pillClass = 'bg-red-500/10 text-red-400 border-red-500/30';
                  } else if (item.classification === 'suspicious') {
                    pillClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  }

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className="hover:bg-navy-card/60 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 text-navy-muted">#{item.id}</td>
                      <td className="py-3 px-4 font-mono text-offwhite max-w-sm truncate">
                        {item.defanged_url || item.url}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${pillClass}`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-offwhite">
                        {Math.round(item.risk_score)}/100
                      </td>
                      <td className="py-3 px-4 text-navy-muted">
                        {Math.round(item.confidence)}%
                      </td>
                      <td className="py-3 px-4 text-navy-muted truncate">
                        {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenDetail(item); }}
                          className="px-2.5 py-1 bg-navy-card hover:bg-navy-dark border border-navy-border hover:border-electric text-offwhite text-[11px] rounded transition"
                        >
                          XAI Report
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Delete scan"
                          className="p-1 hover:text-red-400 text-navy-muted transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {total > pageSize && (
          <div className="p-4 bg-navy-card/60 border-t border-navy-border flex items-center justify-between text-xs font-mono">
            <span className="text-navy-muted">
              Showing page {page} of {totalPages} ({total} total scans)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded bg-navy-surface border border-navy-border disabled:opacity-30 text-offwhite hover:border-electric transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded bg-navy-surface border border-navy-border disabled:opacity-30 text-offwhite hover:border-electric transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Detail Modal */}
      <ScanResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        scan={selectedScan}
      />
    </div>
  );
};

