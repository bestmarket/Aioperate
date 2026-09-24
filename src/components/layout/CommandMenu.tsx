import React, { useState, useEffect } from 'react';
import {
  Search,
  Bot,
  LayoutDashboard,
  Inbox,
  Flame,
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  CalendarCheck,
  Zap,
  BookOpen,
  X,
} from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (nav: string) => void;
  onOpenTest: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onSelectNav,
  onOpenTest,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectNav(''); // Open command
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const quickActions = [
    { id: 'test_ai', label: 'Test AI Employee in Real-time Sandbox', icon: Bot, action: onOpenTest },
    { id: 'dashboard', label: 'Go to Business Dashboard', icon: LayoutDashboard, nav: 'dashboard' },
    { id: 'team_ai', label: 'AI Business Team (8 Specialized Personas)', icon: Users, nav: 'team_ai' },
    { id: 'marketing', label: 'AI Marketing Studio & Copy Generator', icon: Zap, nav: 'marketing' },
    { id: 'strategy', label: 'AI Business Strategist (90-Day Plans)', icon: Zap, nav: 'strategy' },
    { id: 'website_builder', label: 'AI Landing Page & Website Builder', icon: LayoutDashboard, nav: 'website_builder' },
    { id: 'creative', label: 'Creative Studio & Brand Kit', icon: Bot, nav: 'creative' },
    { id: 'documents', label: 'Invoices, Quotes & Receipts', icon: ShoppingBag, nav: 'documents' },
    { id: 'reputation', label: 'Reputation & Customer Sentiment', icon: Users, nav: 'reputation' },
    { id: 'agent', label: 'Configure AI Agent Persona & Actions', icon: Bot, nav: 'agent' },
    { id: 'inbox', label: 'Open Unified Inbox', icon: Inbox, nav: 'inbox' },
    { id: 'leads', label: 'View Captured Leads & Scores', icon: Flame, nav: 'leads' },
    { id: 'products', label: 'Manage Products & Inventory', icon: Package, nav: 'products' },
    { id: 'orders', label: 'Track Orders & Shipping', icon: ShoppingBag, nav: 'orders' },
    { id: 'payments', label: 'View Payments & Invoices', icon: CreditCard, nav: 'payments' },
    { id: 'bookings', label: 'Check Appointment Calendar', icon: CalendarCheck, nav: 'bookings' },
    { id: 'automations', label: 'Automation Rules Builder', icon: Zap, nav: 'automations' },
    { id: 'knowledge', label: 'Manage Knowledge Base Docs', icon: BookOpen, nav: 'knowledge' },
    { id: 'admin', label: 'Open Platform SuperAdmin Portal', icon: LayoutDashboard, nav: 'admin' },
  ];

  const filtered = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) item.action();
                    else if (item.nav) onSelectNav(item.nav);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-medium flex-1">{item.label}</span>
                  <span className="text-[10px] text-slate-400">Select</span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation Shortcuts</span>
          <div className="flex items-center gap-2">
            <span>Use Esc to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
