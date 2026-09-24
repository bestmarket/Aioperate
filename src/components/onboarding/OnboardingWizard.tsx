import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  Globe,
  Clock,
  Mail,
  MapPin,
  Smile,
  Radio,
  X,
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { createBusiness } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state across 10 steps
  const [formData, setFormData] = useState({
    name: '',
    industry: 'consulting',
    website: '',
    description: '',
    sampleOfferings: '',
    businessHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    contactEmail: '',
    contactPhone: '',
    location: '',
    aiPersonality: 'Professional' as 'Professional' | 'Friendly' | 'Premium' | 'Casual' | 'Concise' | 'Custom',
    customPersonality: '',
    channels: ['website', 'whatsapp'],
    brandColor: '#4f46e5',
    currency: 'USD',
  });

  if (!isOpen) return null;

  const industries = [
    { id: 'e-commerce', label: 'E-commerce & Retail' },
    { id: 'restaurant', label: 'Restaurant & Dining' },
    { id: 'hotel', label: 'Hotel & Hospitality' },
    { id: 'salon', label: 'Salon & Spa' },
    { id: 'clinic', label: 'Clinic & Healthcare' },
    { id: 'real estate', label: 'Real Estate & Properties' },
    { id: 'consulting', label: 'Consulting & Strategy' },
    { id: 'agency', label: 'Agency & Creative Studio' },
    { id: 'education', label: 'Education & Coaching' },
    { id: 'repair/service', label: 'Repair & Field Services' },
    { id: 'professional services', label: 'Legal & Professional Services' },
    { id: 'other', label: 'Other Industry' },
  ];

  const personalities = [
    { id: 'Professional', desc: 'Poised, authoritative, articulate, and formal' },
    { id: 'Friendly', desc: 'Warm, welcoming, empathetic, and enthusiastic' },
    { id: 'Premium', desc: 'Sophisticated, bespoke, refined, and concierge-level' },
    { id: 'Casual', desc: 'Approachable, relaxed, modern, and direct' },
    { id: 'Concise', desc: 'Fast, brief, strictly factual, and efficient' },
    { id: 'Custom', desc: 'Tailor your own custom persona and instructions' },
  ];

  const handleNext = () => {
    if (step < 10) setStep(step + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      await createBusiness({
        name: formData.name || 'OmniCorp Business',
        industry: formData.industry,
        website: formData.website || 'https://example.com',
        description: formData.description || 'Modern commercial enterprise.',
        businessHours: formData.businessHours,
        contactEmail: formData.contactEmail || 'contact@business.com',
        contactPhone: formData.contactPhone || '+1 (555) 000-0000',
        location: formData.location || 'New York, NY',
        brandColor: formData.brandColor,
        currency: formData.currency,
      });
      onComplete();
    } catch (err) {
      console.error('Failed to create business:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400">
                Step {step} of 10
              </span>
              <h2 className="text-sm font-semibold text-white">Business Onboarding Wizard</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Set up your AI Business Operating System and configure your autonomous agent.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 flex-1 min-h-[320px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Step 1: Business Identity
              </div>
              <h3 className="text-lg font-bold text-white">What is the legal or brand name of your business?</h3>
              <p className="text-xs text-slate-400">
                Your AI employee will introduce itself representing this name across chat, WhatsApp, and phone.
              </p>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apex Wealth Advisory, Lumina Dental Clinic, Starlight Apparel"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                Step 2: Industry Domain
              </div>
              <h3 className="text-lg font-bold text-white">Select your primary industry</h3>
              <p className="text-xs text-slate-400">
                This primes the AI reasoning model with domain vocabulary, lead qualification schemas, and workflows.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setFormData({ ...formData, industry: ind.id })}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      formData.industry === ind.id
                        ? 'border-indigo-500 bg-indigo-600/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" /> Step 3: Web Presence
              </div>
              <h3 className="text-lg font-bold text-white">What is your business website or store URL?</h3>
              <p className="text-xs text-slate-400">
                Our crawler will index your public FAQs, offerings, and policies to build your initial knowledge brain.
              </p>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                Step 4: Business Description
              </div>
              <h3 className="text-lg font-bold text-white">Describe what your business does and your value proposition</h3>
              <p className="text-xs text-slate-400">
                Give your AI agent background context on what makes your service or product unique.
              </p>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. We provide private wealth advisory, tax mitigation, and estate planning for business founders and family offices with over $2M liquid assets."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                Step 5: Products & Core Services
              </div>
              <h3 className="text-lg font-bold text-white">List your key products or service packages</h3>
              <p className="text-xs text-slate-400">
                The agent will actively recommend these and can create orders or booking slots for them.
              </p>
              <textarea
                rows={4}
                value={formData.sampleOfferings}
                onChange={(e) => setFormData({ ...formData, sampleOfferings: e.target.value })}
                placeholder="e.g. Executive Strategy Retainer ($3,500/mo), Full Business Audit ($1,200), Initial 45-min Zoom Consultation (Free/Deposit)."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" /> Step 6: Operating Hours
              </div>
              <h3 className="text-lg font-bold text-white">What are your official business hours?</h3>
              <p className="text-xs text-slate-400">
                The AI answers 24/7, but it will communicate your staff working hours when human handoffs occur.
              </p>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="e.g. Monday - Friday: 9:00 AM - 6:00 PM EST, Sat 10:00 AM - 4:00 PM"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4" /> Step 7: Contact Information
              </div>
              <h3 className="text-lg font-bold text-white">Official business email and phone number</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="concierge@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Direct Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Step 8: Physical Location
              </div>
              <h3 className="text-lg font-bold text-white">Where is your office, showroom, or studio located?</h3>
              <p className="text-xs text-slate-400">
                Customers frequently ask for directions, parking instructions, or local timezones.
              </p>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. 100 Montgomery Street, Suite 1400, San Francisco, CA 94104"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Smile className="w-4 h-4" /> Step 9: AI Personality & Tone
              </div>
              <h3 className="text-lg font-bold text-white">Choose how your AI employee should speak with customers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {personalities.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setFormData({ ...formData, aiPersonality: p.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.aiPersonality === p.id
                        ? 'border-indigo-500 bg-indigo-600/15'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{p.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Radio className="w-4 h-4" /> Step 10: Connect Channels
              </div>
              <h3 className="text-lg font-bold text-white">Select channels to activate your AI employee on</h3>
              <p className="text-xs text-slate-400">
                The exact same business brain and customer database synchronizes across all selected touchpoints.
              </p>
              <div className="space-y-2">
                {[
                  { id: 'website', title: 'Website Chat Widget', desc: '1-line snippet installable on any website or store' },
                  { id: 'whatsapp', title: 'Official WhatsApp Business Cloud API', desc: 'Two-way automated messaging and follow-up templates' },
                  { id: 'email', title: 'Email Concierge (Inbound/Outbound)', desc: 'Automated inquiry triage, quotes, and calendar confirmations' },
                  { id: 'voice', title: 'AI Voice Receptionist (Architecture Ready)', desc: 'Inbound phone line answering and CRM capture' },
                ].map((ch) => (
                  <label
                    key={ch.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(ch.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...formData.channels, ch.id]
                          : formData.channels.filter((c) => c !== ch.id);
                        setFormData({ ...formData, channels: next });
                      }}
                      className="mt-1 rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{ch.title}</div>
                      <div className="text-[11px] text-slate-400">{ch.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              step === 1 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting || (step === 1 && !formData.name.trim())}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Provisioning Tenant...</span>
            ) : step === 10 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch AI Business Agent</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
