import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

interface ThemeToggleProps {
  variant?: 'compact' | 'expanded' | 'minimal';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'expanded') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl transition-colors ${
          isDark
            ? 'bg-slate-900 border border-slate-800'
            : 'bg-rose-50/70 border border-rose-200/60 shadow-xs'
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            !isDark
              ? 'bg-white text-rose-700 shadow-sm shadow-rose-200/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to Sweet Light theme"
        >
          <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
          <span>Sweet Light</span>
        </button>

        <button
          type="button"
          onClick={() => !isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isDark
              ? 'bg-slate-800 text-indigo-300 shadow-sm shadow-indigo-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Switch to Dark theme"
        >
          <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400 fill-indigo-400/40' : 'text-slate-400'}`} />
          <span>Dark Mode</span>
        </button>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-xl transition-all ${
          isDark
            ? 'text-amber-300 hover:bg-slate-800 hover:text-amber-200'
            : 'text-rose-600 hover:bg-rose-100/60 hover:text-rose-700'
        } ${className}`}
        aria-label={isDark ? 'Switch to Sweet Light Theme' : 'Switch to Dark Theme'}
        title={isDark ? 'Switch to Sweet Light Theme' : 'Switch to Dark Theme'}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    );
  }

  // Default compact pill toggle with cute badge
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
        isDark
          ? 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 shadow-xs'
          : 'bg-white hover:bg-rose-50/50 text-slate-700 border border-rose-200/80 hover:border-rose-300 shadow-sm shadow-rose-200/30'
      } ${className}`}
      aria-label={isDark ? 'Switch to Sweet Light theme' : 'Switch to Dark theme'}
      title={isDark ? 'Switch to Sweet Light theme' : 'Switch to Dark theme'}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-500 transition-transform group-hover:-rotate-12" />
        )}
      </div>
      <span className="text-[11px] font-medium tracking-tight">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};
