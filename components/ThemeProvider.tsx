'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const documentElement = document.documentElement;
    if (theme === 'dark') {
      documentElement.setAttribute('data-theme', 'dark');
    } else {
      documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    toggle
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}