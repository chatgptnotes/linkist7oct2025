'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon' | 'dropdown';
  position?: 'fixed' | 'relative';
}

export function ThemeToggle({
  className = '',
  variant = 'button',
  position = 'relative'
}: ThemeToggleProps) {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-card-fg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    );
  }

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <Monitor
          size={18}
          className="transition-all duration-300 ease-in-out transform group-hover:scale-110"
        />
      );
    }

    return actualTheme === 'dark' ? (
      <Moon
        size={18}
        className="transition-all duration-300 ease-in-out transform rotate-0 group-hover:scale-110 group-hover:-rotate-12"
        fill="currentColor"
      />
    ) : (
      <Sun
        size={18}
        className="transition-all duration-300 ease-in-out transform rotate-0 group-hover:scale-110 group-hover:rotate-12"
        fill="currentColor"
      />
    );
  };

  const getTooltipText = () => {
    if (theme === 'system') return 'System theme';
    return actualTheme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  const baseClasses = `
    group relative inline-flex items-center justify-center
    transition-all duration-200 ease-in-out
    hover:bg-accent/50 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg
  `;

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${baseClasses}
          w-9 h-9 rounded-full
          text-muted hover:text-fg
          ${position === 'fixed' ? 'fixed top-4 right-4 z-50' : ''}
          ${className}
        `}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
        title={getTooltipText()}
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${baseClasses}
        px-3 py-2 rounded-lg border border-border
        text-sm font-medium text-card-fg
        bg-card hover:bg-accent/30
        ${position === 'fixed' ? 'fixed top-4 right-4 z-50' : ''}
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={getTooltipText()}
    >
      <span className="flex items-center gap-2">
        {getIcon()}
        <span className="capitalize">
          {theme === 'system' ? 'Auto' : theme}
        </span>
      </span>
    </button>
  );
}

// Fixed position theme toggle for easy access
export function FixedThemeToggle({ className = '' }: { className?: string }) {
  return (
    <ThemeToggle
      variant="icon"
      position="fixed"
      className={`
        backdrop-blur-sm bg-card/80 border border-border/50
        shadow-lg hover:shadow-xl
        ${className}
      `}
    />
  );
}

// Theme status indicator (useful for debugging)
export function ThemeStatus() {
  const { theme, actualTheme } = useTheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-muted z-50">
      Theme: {theme} | Actual: {actualTheme}
    </div>
  );
}