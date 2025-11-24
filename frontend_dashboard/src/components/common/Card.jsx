import React, { memo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Card
 * A simple surface container with elegant styling.
 */
function CardBase({ title, children, footer, style, ...rest }) {
  return (
    <section
      {...rest}
      role="region"
      aria-label={typeof title === 'string' ? title : undefined}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(0,0,0,0.06)',
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

const Card = memo(CardBase);

export default Card;
