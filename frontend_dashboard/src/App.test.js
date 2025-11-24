import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils/renderWithProviders';

test('renders app shell with navigation and main content', () => {
  renderWithProviders(<App />, { route: '/' });
  // a11y landmarks: banner and navigation present
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  // Default banner message present
  expect(screen.getByRole('status')).toHaveTextContent(/HydroSense/i);
});
