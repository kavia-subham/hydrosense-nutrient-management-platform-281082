/**
 * Global Jest setup for RTL.
 * - adds jest-dom matchers
 * - configures cleanup
 * - mocks requestAnimationFrame and ResizeObserver if needed by components
 * - ensures mocks layer enabled by default
 */
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Ensure RTL does not get noisy about automatic cleanup (CRA v5 already does it)
configure({ asyncUtilTimeout: 2000 });

// Mock requestAnimationFrame
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}
if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}

// Mock ResizeObserver if not present
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = MockResizeObserver;
}

// Default feature flags and USE_MOCKS for tests
process.env.REACT_APP_FEATURE_FLAGS = process.env.REACT_APP_FEATURE_FLAGS || JSON.stringify({ maintenance: false });
process.env.REACT_APP_USE_MOCKS = process.env.REACT_APP_USE_MOCKS || 'true';
