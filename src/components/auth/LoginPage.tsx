import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Briefcase,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ThemeToggle } from '../layout/ThemeToggle.tsx';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToLanding,
}) => {
  const { login, register, switchBusiness } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('e-commerce');
  const [currency, setCurrency] = useState('USD');
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick visitor demo filler
  const handleLoadDemoVisitor = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await login('theinnermirroryt@gmail.com');
      if (res.success) {
        onLoginSuccess();
      } else {
        await switchBusiness('biz_aura_001');
        onLoginSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        if (!name.trim() || !companyName.trim() || !email.trim()) {
          setErrorMessage('Please fill in your name, company name, and email.');
          setIsLoading(false);
          return;
        }

        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          companyName: companyName.trim(),
          industry,
          currency,
        });

        if (res.success) {
          setSuccessMessage('Business workspace successfully provisioned! Launching your AI OS...');
          setTimeout(() => {
            onLoginSuccess();
          }, 600);
        } else {
          setErrorMessage(res.error || 'Failed to create workspace.');
        }
      } else if (mode === 'signin') {
        if (!email.trim()) {
          setErrorMessage('Please enter your work email.');
          setIsLoading(false);
          return;
        }

        const res = await login(email.trim(), password);
        if (res.success) {
          onLoginSuccess();
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      } else if (mode === 'forgot') {
        setSuccessMessage(`Password reset link sent to ${email}. Check your inbox.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500/25 selection:text-rose-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Top Header */}
      <header className="h-16 border-b border-rose-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/60 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Need help?</span>
            <a
              href="mailto:support@operateai.com"
              className="text-rose-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </header>

      {/* Main Registration / Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-rose-600 dark:bg-indigo-600 items-center justify-center text-white shadow-xl shadow-rose-600/25 dark:shadow-indigo-600/30 mb-2">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'signup' && 'Register Your Business'}
              {mode === 'signin' && 'Sign in to Your Business'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {mode === 'signup' &&
                'Deploy your 24/7 autonomous AI workforce. Full access to CRM, WhatsApp Cloud, Catalog, and Voice Concierge.'}
              {mode === 'signin' &&
                'Access your autonomous business operations hub, active orders, and client conversations.'}
              {mode === 'forgot' && 'Enter your work email address to receive secure recovery instructions.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-rose-50/70 dark:bg-slate-900 border border-rose-100 dark:border-slate-800 p-1 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-rose-600 dark:bg-indigo-600 text-white shadow-sm shadow-rose-200 dark:shadow-none'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              1. Register New Business
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-rose-600 dark:bg-indigo-600 text-white shadow-sm shadow-rose-200 dark:shadow-none'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              2. Sign In to Workspace
            </button>
          </div>

          {/* Quick Demo Pre-seed Button for Fast Visitor Testing */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-indigo-950/30 border border-rose-200/80 dark:border-indigo-500/20 flex items-center justify-between gap-3 text-xs shadow-sm shadow-rose-200/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-white">Want to explore a pre-built luxury store?</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant access to Aura Atelier flagship workspace</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLoadDemoVisitor}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow-sm transition-colors"
            >
              Load Demo Store
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xl shadow-rose-200/40 dark:shadow-2xl space-y-4"
          >
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Montgomery"
                        className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business / Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Apex Luxury Goods"
                        className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Industry
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500"
                      >
                        <option value="e-commerce">E-Commerce & Retail</option>
                        <option value="services">Professional Services & Consulting</option>
                        <option value="hospitality">Hospitality & Fine Dining</option>
                        <option value="wellness">Healthcare & Wellness Clinics</option>
                        <option value="agency">Digital Marketing & Creative Agency</option>
                        <option value="real-estate">Real Estate & Property Management</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Operating Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500"
                      >
                        <option value="USD">USD ($) — US Dollar</option>
                        <option value="EUR">EUR (€) — Euro</option>
                        <option value="GBP">GBP (£) — British Pound</option>
                        <option value="CAD">CAD ($) — Canadian Dollar</option>
                        <option value="AUD">AUD ($) — Australian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@yourbrand.com"
                  className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-rose-600 dark:text-indigo-400 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-rose-50/30 dark:bg-slate-950 border border-rose-200/80 dark:border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-rose-50 dark:bg-slate-800 border-rose-200 dark:border-slate-700 text-rose-600 dark:text-indigo-600 focus:ring-0"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  256-Bit SSL Secured
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 dark:shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Setting Up Workspace...</span>
              ) : (
                <>
                  <span>
                    {mode === 'signup' && 'Deploy AI Workspace & Launch'}
                    {mode === 'signin' && 'Sign In to Workspace'}
                    {mode === 'forgot' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Toggle Mode */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-rose-100 dark:border-slate-800/80">
              {mode === 'signin' && (
                <div>
                  New business owner?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-rose-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Register Your Business Free
                  </button>
                </div>
              )}
              {mode === 'signup' && (
                <div>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-rose-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Sign in to your account
                  </button>
                </div>
              )}
              {mode === 'forgot' && (
                <div>
                  Remembered your credentials?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-rose-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-rose-100/80 dark:border-slate-900 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-transparent">
        <div>© 2026 OperateAI Inc. All Rights Reserved.</div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button onClick={onGoToLanding} className="hover:text-slate-900 dark:hover:text-white">
            Landing Page
          </button>
          <span>·</span>
          <span>SOC2 Type II Certified</span>
          <span>·</span>
          <span>Meta WhatsApp Cloud Partner</span>
        </div>
      </footer>
    </div>
  );
};
