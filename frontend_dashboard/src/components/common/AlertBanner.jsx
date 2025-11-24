import React from 'react';

/**
 * PUBLIC_INTERFACE
 * AlertBanner
 * A simple, dismissible placeholder banner region for system-wide alerts.
 * Currently non-interactive; intended for future integration with alert feed.
 */
export default function AlertBanner({ message, type = 'info' }) {
  if (!message) return null;

  const bgByType = {
    info: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))',
    success: 'rgba(16, 185, 129, 0.1)',
    error: 'rgba(239, 68, 68, 0.12)',
    warning: 'rgba(245, 158, 11, 0.12)',
  };

  const borderByType = {
    info: '1px solid rgba(124, 58, 237, 0.35)',
    success: '1px solid rgba(5, 150, 105, 0.35)',
    error: '1px solid rgba(220, 38, 38, 0.35)',
    warning: '1px solid rgba(245, 158, 11, 0.40)',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: bgByType[type] || bgByType.info,
        border: borderByType[type] || borderByType.info,
        color: 'var(--color-text)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: 16,
      }}
    >
      <strong style={{ color: 'var(--color-primary)' }}>System</strong>{' '}
      <span>{message}</span>
    </div>
  );
}
