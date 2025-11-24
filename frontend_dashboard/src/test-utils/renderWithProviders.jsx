import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../components/common/ThemeProvider';
import StoreProvider from '../state/StoreProvider';
import ToastCenter from '../components/common/ToastCenter';
import { render } from '@testing-library/react';

/**
 * PUBLIC_INTERFACE
 * renderWithProviders
 * Render helper that wraps components with ThemeProvider, StoreProvider, Toasts, and MemoryRouter.
 */
export function renderWithProviders(ui, { route = '/', routerProps = {}, renderOptions = {} } = {}) {
  const Wrapper = ({ children }) => (
    <ThemeProvider>
      <StoreProvider>
        <ToastCenter>
          <MemoryRouter initialEntries={[route]} {...routerProps}>
            {children}
          </MemoryRouter>
        </ToastCenter>
      </StoreProvider>
    </ThemeProvider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
