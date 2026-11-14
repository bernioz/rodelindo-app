import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  dark: {
    bg:        '#0B0F14',
    surface1:  '#151B23',
    surface2:  '#1E2530',
    border:    '#2A3341',
    textPrim:  '#F5F7FA',
    textSec:   '#8A93A3',
    textMuted: '#4A5568',
    accent:    '#3DDC84',
    accentDark:'#1a6b3a',
  },
  light: {
    bg:        '#F5F7FA',
    surface1:  '#FFFFFF',
    surface2:  '#EEF0F4',
    border:    '#D1D5DB',
    textPrim:  '#111827',
    textSec:   '#6B7280',
    textMuted: '#9CA3AF',
    accent:    '#1a6b3a',
    accentDark:'#145c30',
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 1.2 = grande, 0.85 = pequeño

  const toggleMode = () => setMode((m) => m === 'dark' ? 'light' : 'dark');
  const theme = THEMES[mode];

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
