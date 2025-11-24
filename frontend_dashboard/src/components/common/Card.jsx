import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card
 * A simple surface container with elegant styling.
 */
export default function Card({ title, children, footer, style, ...rest }) {
  return (
    <section
      {...rest}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(0,0,0,0.04)',
        padding: 16,
        ...style,
      }}
    >
      {title ? (
        <header
          style={{
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: 'var(--color-text)',
              fontWeight: 600,
              letterSpacing: '0.2px',
            }}
          >
            {title}
          </h3>
        </header>
      ) : null}
      <div>{children}</div>
      {footer ? (
        <footer style={{ marginTop: 12, color: 'var(--color-secondary)' }}>
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
