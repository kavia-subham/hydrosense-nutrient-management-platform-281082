import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

/**
 * PUBLIC_INTERFACE
 * Topbar
 * Displays application title and theme toggle placeholder area for future actions.
 */
export default function Topbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <header
      role="banner"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background:
              'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
            boxShadow: 'var(--shadow-soft)',
          }}
        />
        <h1
          style={{
            fontSize: 18,
            margin: 0,
            color: 'var(--color-text)',
            letterSpacing: 0.2,
          }}
        >
          HydroSense Dashboard
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-soft)',
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = 'var(--focus-ring)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <div
          aria-label="User menu placeholder"
          role="group"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.06)',
            background: '#fff',
          }}
        />
      </div>
    </header>
  );
}
