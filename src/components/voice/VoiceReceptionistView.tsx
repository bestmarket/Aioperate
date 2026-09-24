import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
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
} from 'lucide-react';

export const VoiceReceptionistView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [provider, setProvider] = useState('twilio');
  const [voiceTone, setVoiceTone] = useState('Sarah - Warm & Natural (Neural)');
  const [inboundEnabled, setInboundEnabled] = useState(true);
  const [sampleCallActive, setSampleCallActive] = useState(false);
  const [sampleTranscript, setSampleTranscript] = useState<string[]>([]);

  const handleSimulateCall = () => {
    setSampleCallActive(true);
    setSampleTranscript([
      'AI: "Good afternoon, thank you for calling Aura Atelier. I am your concierge assistant. How may I direct your inquiry?"',
      'Caller: "Hi, I wanted to inquire if you have evening tuxedos available for fitting this Friday?"',
      'AI: "Certainly! We have several bespoke dinner jackets and tuxedo silhouettes available. Our master tailor has slots open Friday at 2:00 PM and 4:30 PM. May I reserve the 2:00 PM slot under your name?"',
      'Caller: "2:00 PM sounds great. My name is David Sterling."',
      'AI: "Wonderful, Mr. Sterling. I have captured your details and sent a confirmation SMS to your mobile line. We look forward to welcoming you Friday at 2:00 PM."',
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">AI Voice Receptionist & Telephony</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture-ready 24/7 inbound phone answering that transcribes calls, captures leads, and books slots directly into your CRM.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          SIP Engine Ready
        </span>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            Telephony Provider Configuration
          </h3>

          <div>
            <label className="text-slate-300 block mb-1">Voice Telephony Gateway</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="twilio">Twilio Voice SIP Trunk</option>
              <option value="vapi">Vapi.ai Realtime Speech Pipeline</option>
              <option value="bland">Bland AI Enterprise Phone</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Voice Model & Accent</label>
            <select
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="Sarah - Warm & Natural (Neural)">Sarah - Warm & Natural (US Neural)</option>
              <option value="Marcus - British Bespoke (Neural)">Marcus - British Bespoke (UK Concierge)</option>
              <option value="Elena - Sophisticated Continental">Elena - Sophisticated European</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inboundEnabled}
                onChange={(e) => setInboundEnabled(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-200">Answer inbound business phone line 24/7 autonomously</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-200">Automatically sync call recordings & transcripts to customer CRM</span>
            </label>
          </div>
        </div>

        {/* Live Simulation Sandbox */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              Simulate Inbound Phone Call
            </h3>
            <p className="text-slate-400 mt-1">
              Experience how the voice model handles phone inquiries and registers CRM appointments.
            </p>

            {sampleCallActive && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px] max-h-52 overflow-y-auto">
                {sampleTranscript.map((t, i) => (
                  <div key={i} className="text-slate-300 leading-relaxed">{t}</div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSimulateCall}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>Simulate Inbound Receptionist Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
