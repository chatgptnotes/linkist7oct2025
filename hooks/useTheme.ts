'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export the ThemeContext as well for advanced use cases
export { ThemeContext } from '@/providers/ThemeProvider';