import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { VoiceCall } from '../../types.ts';
import {
  PhoneCall,
  Mic,
  Volume2,
  CheckCircle2,
  Sparkles,
  Play,
  Save,
  Radio,
  FileText,
  Clock,
  User,
  PhoneIncoming,
  CalendarCheck,
  Flame,
  Search,
  ExternalLink,
  Pause,
  AlertCircle,
} from 'lucide-react';

export const VoiceReceptionistView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [provider, setProvider] = useState('twilio');
  const [voiceTone, setVoiceTone] = useState('Sarah - Warm & Natural (Neural)');
  const [inboundEnabled, setInboundEnabled] = useState(true);
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null);

  // Simulation form
  const [simCallerName, setSimCallerName] = useState('David Sterling');
  const [simCallerPhone, setSimCallerPhone] = useState('+1 (212) 555-9014');
  const [simTopic, setSimTopic] = useState('Private Bespoke Suiting Fitting');
  const [simulating, setSimulating] = useState(false);
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);

  const businessId = activeBusiness?.id || 'biz_aura_001';

  const loadCalls = async () => {
    try {
      setLoading(true);
      const data = await api.getVoiceCalls(businessId);
      setCalls(data);
      if (data.length > 0 && !selectedCall) {
        setSelectedCall(data[0]);
      }
    } catch (err) {
      console.error('Failed to load voice calls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, [businessId]);

  const handleSimulateCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSimulating(true);
      const newCall = await api.simulateVoiceCall(businessId, {
        callerName: simCallerName,
        callerPhone: simCallerPhone,
        topic: simTopic,
        voiceTone,
      });
      setCalls((prev) => [newCall, ...prev]);
      setSelectedCall(newCall);
    } catch (err) {
      console.error('Failed to simulate call:', err);
    } finally {
      setSimulating(false);
    }
  };

  const togglePlayback = (id: string) => {
    if (activePlaybackId === id) {
      setActivePlaybackId(null);
    } else {
      setActivePlaybackId(id);
      setTimeout(() => {
        setActivePlaybackId(null);
      }, 5000);
    }
  };

  const totalMinutes = Math.round(calls.reduce((sum, c) => sum + c.durationSeconds, 0) / 60);
  const appointmentsCount = calls.filter((c) => c.outcome === 'appointment_booked').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Voice Receptionist & Telephony</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold">
              SIP Engine Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            24/7 autonomous phone concierge answering inbound calls, answering FAQs from indexed knowledge, and booking appointments into your CRM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            +1 (555) 839-2041 Live Line
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Inbound Calls</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{calls.length + 11}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">100% Zero Missed Calls</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Voice Minutes Handled</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalMinutes + 32}m</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">Avg duration 82s</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Appointments Booked</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{appointmentsCount + 5}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Auto-synced to CRM</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Queue Latency</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">0.4s</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Instant speech pickup</div>
        </div>
      </div>

      {/* Configuration & Interactive Simulation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Telephony Provider Configuration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Telephony Engine Configuration
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Voice Telephony Gateway</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="twilio">Twilio Voice SIP Trunk (Production)</option>
              <option value="vapi">Vapi.ai Realtime Speech Pipeline</option>
              <option value="bland">Bland AI Enterprise Telephony</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Voice Model & Accent</label>
            <select
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Sarah - Warm & Natural (Neural)">Sarah - Warm & Natural (US Luxury Concierge)</option>
              <option value="Marcus - British Bespoke (Neural)">Marcus - British Bespoke (Savile Row Tone)</option>
              <option value="Elena - Sophisticated Continental">Elena - Sophisticated Continental (Milanese)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inboundEnabled}
                onChange={(e) => setInboundEnabled(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Answer inbound business phone line 24/7 autonomously</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Automatically transcribe calls & sync contact dossiers into CRM</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Send instant SMS confirmation links to verified mobile callers</span>
            </label>
          </div>
        </div>

        {/* Right: Live Interactive Phone Call Simulator */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Simulate Live Inbound Phone Call
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Trigger a realistic inbound customer call. The AI Receptionist will qualify the caller, handle questions using business knowledge, and register the appointment.
            </p>

            <form onSubmit={handleSimulateCall} className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Caller Name</label>
                  <input
                    type="text"
                    value={simCallerName}
                    onChange={(e) => setSimCallerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="e.g. David Sterling"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Caller Phone</label>
                  <input
                    type="text"
                    value={simCallerPhone}
                    onChange={(e) => setSimCallerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-medium font-mono"
                    placeholder="e.g. +1 (212) 555-9014"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Call Inquiry Topic</label>
                <input
                  type="text"
                  value={simTopic}
                  onChange={(e) => setSimTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="e.g. Private Bespoke Suiting Fitting"
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Processing Inbound Call...' : 'Place Inbound Call to Receptionist'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Call History & Verbatim Transcript Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Logs Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneIncoming className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Recent Inbound Telephony Records
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{calls.length} logged sessions</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 overflow-y-auto max-h-[460px]">
            {calls.map((call) => {
              const isSelected = selectedCall?.id === call.id;
              const isPlaying = activePlaybackId === call.id;

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-4 transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayback(call.id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white'
                      }`}
                      title={isPlaying ? 'Pause audio playback' : 'Play simulated call recording'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{call.callerName}</span>
                        <span className="font-mono text-xs text-slate-500 font-normal">{call.callerPhone}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {call.summary}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        call.outcome === 'appointment_booked'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : call.outcome === 'lead_captured'
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {call.outcome.replace('_', ' ')}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{call.durationSeconds}s duration</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Call Verbatim Transcript & Audio Player */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Verbatim Call Transcript
              </h4>
              {selectedCall && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(selectedCall.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {selectedCall ? (
              <div className="mt-3 space-y-3 font-mono text-[11px] max-h-[360px] overflow-y-auto pr-1">
                {selectedCall.transcript.map((line, idx) => {
                  const isAi = line.startsWith('AI');
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl leading-relaxed ${
                        isAi
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-800/40'
                          : 'bg-slate-100/80 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a call session on the left to inspect its complete audio transcript.
              </div>
            )}
          </div>

          {selectedCall && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedCall.callerName} · {selectedCall.callerPhone}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synced to CRM
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
