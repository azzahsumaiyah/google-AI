import React from 'react';
import { Sun, Moon, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetDemo: () => void;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onResetDemo,
  completedCount,
  totalCount,
}) => {
  // Format current date in Indonesian
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand & Date */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white" />
            <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Klar
            </h1>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 capitalize hidden sm:inline-block">
            {formattedDate}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            title="Reset ke contoh bawaan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Contoh</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti mode tema"
            className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700 transition-transform rotate-0 scale-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
