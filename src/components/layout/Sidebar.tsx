import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Inbox,
  MessageSquare,
  Smartphone,
  Flame,
  Users,
  Briefcase,
  Package,
  ShoppingBag,
  CreditCard,
  CalendarCheck,
  Zap,
  BookOpen,
  BarChart3,
  Megaphone,
  Truck,
  PhoneCall,
  UserCheck,
  PlugZap,
  Receipt,
  Settings,
  Shield,
  Layers,
  FileText,
  Compass,
  Palette,
  Globe,
  Star,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  mobileOpen,
  setMobileOpen,
  unreadCount = 1,
}) => {
  const navSections = [
    {
      group: 'Core Operating System',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'team_ai', label: 'AI Business Team', icon: Users, badge: '8 Roles' },
        { id: 'agent', label: 'Agent Builder', icon: Bot, badge: 'Active' },
        { id: 'inbox', label: 'Unified Inbox', icon: Inbox, badgeCount: unreadCount },
        { id: 'widget', label: 'Website Chat', icon: MessageSquare },
        { id: 'whatsapp', label: 'WhatsApp Cloud', icon: Smartphone },
        { id: 'voice', label: 'Voice Receptionist', icon: PhoneCall, badge: 'Ready' },
      ],
    },
    {
      group: 'AI Growth & Marketing',
      items: [
        { id: 'marketing', label: 'Marketing Studio', icon: Megaphone, badge: 'New' },
        { id: 'strategy', label: 'Business Strategist', icon: Compass, badge: 'New' },
        { id: 'website_builder', label: 'Website Builder', icon: Globe, badge: 'New' },
        { id: 'creative', label: 'Brand Kit & Creative', icon: Palette, badge: 'New' },
        { id: 'reputation', label: 'Reputation & Reviews', icon: Star, badge: 'New' },
        { id: 'campaigns', label: 'Campaigns', icon: Layers },
      ],
    },
    {
      group: 'Revenue & Operations',
      items: [
        { id: 'leads', label: 'Leads & Scoring', icon: Flame },
        { id: 'crm', label: 'CRM & Activity', icon: Briefcase },
        { id: 'products', label: 'Catalog & Menu', icon: Package },
        { id: 'orders', label: 'Orders & Sales', icon: ShoppingBag },
        { id: 'shipping', label: 'Shipping Labels', icon: Truck },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'bookings', label: 'Bookings & Calendar', icon: CalendarCheck },
        { id: 'documents', label: 'Invoices & Quotes', icon: FileText, badge: 'New' },
      ],
    },
    {
      group: 'Automation & Knowledge',
      items: [
        { id: 'automations', label: 'Automations', icon: Zap },
        { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
        { id: 'analytics', label: 'Analytics & ROI', icon: BarChart3 },
      ],
    },
    {
      group: 'Organization & Platform',
      items: [
        { id: 'team', label: 'Staff & Roles', icon: UserCheck },
        { id: 'integrations', label: 'Integrations', icon: PlugZap },
        { id: 'billing', label: 'Billing & Plans', icon: Receipt },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900 border-r border-rose-100/80 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-rose-100/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 dark:bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 dark:shadow-indigo-500/20 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white">OperateAI</span>
              <span className="text-[10px] text-rose-500 dark:text-indigo-400 block -mt-1 font-semibold">Business OS</span>
            </div>
          </div>
          <div className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-rose-50 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700/50">
            SaaS v2.4
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, i) => (
            <div key={i} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {sec.group}
              </div>
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNav(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 dark:bg-indigo-600 dark:text-white dark:shadow-indigo-600/30 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badgeCount ? (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      ) : item.badge ? (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-rose-50 text-rose-600 border border-rose-200/60 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status & Switch to Landing */}
        <div className="p-3 border-t border-rose-100/80 dark:border-slate-800 bg-rose-50/30 dark:bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-rose-100 dark:border-slate-700/50 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">AI Team Online</span>
            </div>
            <button
              onClick={() => setActiveNav('landing')}
              className="text-[11px] text-rose-600 hover:text-rose-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
            >
              Public Site →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
