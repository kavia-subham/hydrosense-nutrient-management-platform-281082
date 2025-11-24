import React, { createContext, useEffect, useMemo, useState } from 'react';
import { RoyalPurple, getThemeVars } from '../../theme/colors';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  palette: RoyalPurple,
});

/**
 * PUBLIC_INTERFACE
 * ThemeProvider
 * Wraps the application, applying Royal Purple theme via CSS variables on :root
 * and managing a data-theme attribute for future dark mode support.
 * Respects prefers-color-scheme but defaults to elegant light theme.
 */
export default function ThemeProvider({ children }) {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState(prefersDark ? 'dark' : 'light');

  // Memoize vars for performance
  const cssVars = useMemo(() => getThemeVars(RoyalPurple), []);

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    // Set data-theme for potential dark styling in the future
    root.setAttribute('data-theme', theme);
  }, [theme, cssVars]);

  const value = useMemo(
    () => ({ theme, setTheme, palette: RoyalPurple }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
