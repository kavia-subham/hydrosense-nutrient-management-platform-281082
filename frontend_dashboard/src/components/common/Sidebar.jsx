import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/sensors', label: 'Sensors' },
  { to: '/controls', label: 'Controls' },
  { to: '/crops', label: 'Crops' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/settings', label: 'Settings' },
];

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Provides primary navigation with accessible semantics and keyboard support.
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef(null);

  // Collapse on narrow screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 920px)');
    const onChange = (e) => setCollapsed(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !collapsed) {
      setCollapsed(true);
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Primary"
      onKeyDown={handleKeyDown}
      style={{
        width: collapsed ? 64 : 240,
        transition: 'width 200ms ease',
        background:
          'linear-gradient(180deg, var(--gradient-start), var(--gradient-end))',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        padding: 12,
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.06)',
          background: 'var(--color-surface)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: 12,
        }}
      >
        {collapsed ? '›' : '‹'} Menu
      </button>
      <ul
        role="menubar"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 6,
        }}
      >
        {navItems.map((item) => (
          <li key={item.to} role="none">
            <NavLink
              to={item.to}
              role="menuitem"
              tabIndex={0}
              className={({ isActive }) => (isActive ? 'active' : '')}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                color: 'var(--color-text)',
                background: isActive
                  ? 'rgba(124, 58, 237, 0.14)'
                  : 'rgba(255, 255, 255, 0.85)',
                border: isActive
                  ? '1px solid rgba(124, 58, 237, 0.40)'
                  : '1px solid rgba(0,0,0,0.06)',
                padding: '10px 12px',
                borderRadius: 10,
                outline: 'none',
              })}
              aria-current={({ isActive }) => undefined}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = 'var(--focus-ring)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'inline-block',
                }}
              />
              <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms' }}>
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
