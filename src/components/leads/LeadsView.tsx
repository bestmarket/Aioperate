import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Lead } from '../../types.ts';
import {
  Flame,
  Search,
  Download,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  DollarSign,
  Plus,
} from 'lucide-react';

export const LeadsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScore, setSelectedScore] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads(businessId);
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [businessId]);

  const handleUpdateStatus = async (leadId: string, status: Lead['status']) => {
    try {
      const updated = await api.updateLead(businessId, leadId, { status });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (selectedLead?.id === leadId) setSelectedLead(updated);
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Interest', 'Value', 'Score', 'Status', 'Created'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.phone,
      `"${l.interest}"`,
      l.value,
      l.score,
      l.status,
      l.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_${activeBusiness?.name || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.interest.toLowerCase().includes(search.toLowerCase());
    const matchesScore = selectedScore === 'all' || l.score === selectedScore;
    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;
    return matchesSearch && matchesScore && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-white">Autonomous Lead Capture & Scoring</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every customer conversation is automatically analyzed for intent, estimated budget, urgency, and buying timeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedScore}
            onChange={(e) => setSelectedScore(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Intent Scores</option>
            <option value="high">High (Hot / Ready)</option>
            <option value="medium">Medium (Warm / Evaluating)</option>
            <option value="low">Low (Cold / Browsing)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="won">Won / Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Lead & Contact</th>
                  <th className="px-4 py-3">Interest & Deal Value</th>
                  <th className="px-4 py-3">AI Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No leads match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => {
                    const isSelected = selectedLead?.id === l.id;
                    return (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLead(l)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-600/10' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{l.name}</div>
                          <div className="text-[11px] text-slate-400">{l.email || l.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 truncate max-w-[160px]">{l.interest}</div>
                          <div className="text-emerald-400 font-semibold font-mono">${l.value}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                              l.score === 'high'
                                ? 'bg-amber-500/20 text-amber-300'
                                : l.score === 'medium'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {l.score} ({l.scoreValue}%)
                          </span>
                        </td>
                        <td className="px-4 py-3 capitalize">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              l.status === 'won'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : l.status === 'qualified'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(l.id, l.status === 'won' ? 'qualified' : 'won');
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                          >
                            {l.status === 'won' ? 'Reopen' : 'Mark Won'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Profile Panel */}
        {selectedLead ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedLead.name}</h3>
                <span className="text-[11px] text-slate-400">Captured via {selectedLead.source}</span>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold text-sm font-mono">${selectedLead.value}</div>
                <span className="text-[10px] text-slate-400">Estimated Value</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Contact Info</span>
                <div className="text-slate-200 mt-0.5 font-medium">{selectedLead.email || 'No email provided'}</div>
                <div className="text-slate-200 text-[11px]">{selectedLead.phone || 'No phone provided'}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Primary Interest</span>
                <div className="text-slate-200 font-medium mt-0.5">{selectedLead.interest}</div>
              </div>

              {selectedLead.qualificationAnswers && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-indigo-400 font-semibold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Qualification Answers
                  </div>
                  {selectedLead.qualificationAnswers.budget && (
                    <div className="text-slate-300">Budget: {selectedLead.qualificationAnswers.budget}</div>
                  )}
                  {selectedLead.qualificationAnswers.timeline && (
                    <div className="text-slate-300">Timeline: {selectedLead.qualificationAnswers.timeline}</div>
                  )}
                </div>
              )}

              <div>
                <span className="text-slate-400 text-[10px] block">AI & Staff Notes</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {selectedLead.notes || 'Captured automatically during conversation.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block mb-1">Update Status</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['new', 'qualified', 'contacted', 'won', 'lost'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedLead.id, st)}
                      className={`py-1.5 rounded-lg text-center text-xs font-semibold capitalize transition-colors ${
                        selectedLead.status === st
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-xs text-slate-400 flex items-center justify-center">
            Select a lead to view details.
          </div>
        )}
      </div>
    </div>
  );
};
