import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Users,
  Shield,
  Plus,
  Mail,
  CheckCircle2,
  Trash2,
  Lock,
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { activeBusiness, user } = useAuth();
  const [members, setMembers] = useState([
    { id: '1', name: user?.name || 'Alexander Wright', email: user?.email || 'owner@operateai.internal', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Marcus Vance', email: 'marcus@auraatelier.com', role: 'Staff Specialist', status: 'Active' },
    { id: '3', name: 'Elena Rostova', email: 'elena@auraatelier.com', role: 'Admin', status: 'Active' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Team Members & Role-Based Permissions</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage staff privileges, conversation assignees, and administrator access for {activeBusiness?.name}.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{m.name}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-medium ${
                        m.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.role !== 'Owner' && (
                      <button
                        onClick={() => setMembers((prev) => prev.filter((item) => item.id !== m.id))}
                        className="p-1 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Invite Team Colleague</h3>

            <div>
              <label className="text-slate-300 block mb-1">Work Email</label>
              <input
                type="email"
                placeholder="colleague@auraatelier.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Role & Permission Tier</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Admin">Admin (Full tenant configuration)</option>
                <option value="Manager">Manager (CRM, Orders, Bookings)</option>
                <option value="Staff Specialist">Staff Specialist (Inbox reply & appointments)</option>
                <option value="Viewer">Viewer (Read-only analytics)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
