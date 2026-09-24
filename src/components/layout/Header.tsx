import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Building2,
  ChevronDown,
  Plus,
  Search,
  Bell,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';

interface HeaderProps {
  onOpenCommand: () => void;
  onOpenLiveTest: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommand,
  onOpenLiveTest,
  activeNav,
  setActiveNav,
  onToggleMobileMenu,
}) => {
  const { user, activeBusiness, businesses, switchBusiness, setShowOnboarding } = useAuth();
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-rose-100/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Left: Mobile hamburger & Tenant Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Tenant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTenantMenu(!showTenantMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-rose-50/50 hover:bg-rose-50/80 border border-rose-200/60 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-700/60 transition-all text-left group shadow-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-600/15 text-rose-600 dark:bg-indigo-600/20 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              {activeBusiness?.name?.[0] || 'O'}
            </div>
            <div className="max-w-[140px] sm:max-w-[200px] truncate">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-600 dark:group-hover:text-white transition-colors">
                {activeBusiness?.name || 'Select Business'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <span>{activeBusiness?.industry || 'Business'}</span>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform" />
          </button>

          {showTenantMenu && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xl shadow-rose-200/30 dark:shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-rose-100/60 dark:border-slate-800/80">
                Switch Business Workspace
              </div>
              <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                {businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      switchBusiness(biz.id);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      biz.id === activeBusiness?.id
                        ? 'bg-rose-50 text-rose-700 dark:bg-indigo-600/15 dark:text-indigo-300 font-medium'
                        : 'text-slate-700 hover:bg-rose-50/50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate font-semibold">{biz.name}</div>
                      <div className="text-[10px] text-slate-400">{biz.industry} · {biz.currency}</div>
                    </div>
                    {biz.id === activeBusiness?.id && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-indigo-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-rose-50/40 dark:bg-slate-950/60 border border-rose-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:border-rose-300 dark:hover:border-slate-700 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search customers, orders, tools, or press ⌘K...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] rounded-md bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-rose-200/80 dark:border-slate-700 font-mono shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Theme Toggle, Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sweet Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Public Landing Link */}
        <button
          onClick={() => setActiveNav('landing')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50/60 text-slate-700 border border-rose-200/70 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:border-slate-700/60 text-xs font-semibold transition-colors shadow-xs"
          title="View Public Landing Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </button>

        {/* Test AI Live Widget Button */}
        <button
          onClick={onOpenLiveTest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-rose-300 dark:text-white" />
          <span className="hidden sm:inline">Concierge Chat</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 dark:bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-2xl p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100/70 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>Real-time AI Activity</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Active monitoring</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50/40 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-800">
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">New Qualified Lead Captured</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Claire Chen qualified for $3,650 Gala Suit.</div>
                  <div className="text-slate-400 text-[10px] mt-1">2 mins ago · Website Chat</div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/40 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-800">
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">VIP Booking Reserved</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Private fitting confirmed for Thursday 3:00 PM.</div>
                  <div className="text-slate-400 text-[10px] mt-1">14 mins ago · AI Concierge</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-rose-200/80 dark:border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={user?.name || 'User'}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-200 dark:ring-slate-700"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user?.name || 'Sarah M.'}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Owner'}</div>
          </div>
          <button
            onClick={() => setActiveNav('login')}
            className="ml-1 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 text-[11px] transition-colors"
            title="Sign out / Switch account"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
