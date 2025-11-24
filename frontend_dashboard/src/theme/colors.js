export const RoyalPurple = {
  name: 'Royal Purple',
  // Core palette
  primary: '#8B5CF6',
  secondary: '#6B7280',
  success: '#10B981',
  error: '#EF4444',
  background: '#F3E8FF',
  surface: '#FFFFFF',
  text: '#374151',
  // Extended tokens for elegance
  gradientStart: '#E9D5FF', // from-purple-100
  gradientEnd: '#D8B4FE', // to-purple-300
};

// PUBLIC_INTERFACE
export function getThemeVars(theme = RoyalPurple) {
  /** Returns a flat map of CSS variables for the theme. */
  return {
    '--color-primary': theme.primary,
    '--color-secondary': theme.secondary,
    '--color-success': theme.success,
    '--color-error': theme.error,
    '--color-bg': theme.background,
    '--color-surface': theme.surface,
    '--color-text': theme.text,
    '--gradient-start': theme.gradientStart,
    '--gradient-end': theme.gradientEnd,
    '--shadow-soft': '0 4px 16px rgba(139, 92, 246, 0.15)',
    '--radius-md': '12px',
    '--radius-lg': '16px',
    '--focus-ring': '0 0 0 3px rgba(139, 92, 246, 0.35)',
  };
}
