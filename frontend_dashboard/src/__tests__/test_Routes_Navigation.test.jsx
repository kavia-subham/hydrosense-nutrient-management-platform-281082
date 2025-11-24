import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import userEvent from '@testing-library/user-event';

describe('App routes integration', () => {
  test('navigates between routes via Sidebar links', async () => {
    renderWithProviders(<App />, { route: '/' });
    // Start on Dashboard
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    // Navigate to Sensors
    const sensorsLink = screen.getByRole('menuitem', { name: /sensors/i });
    await userEvent.click(sensorsLink);
    expect(screen.getByText(/Sensors/i)).toBeInTheDocument();

    // Navigate to Alerts
    const alertsLink = screen.getByRole('menuitem', { name: /alerts/i });
    await userEvent.click(alertsLink);
    expect(screen.getByText(/Alerts/i)).toBeInTheDocument();

    // Navigate to Controls
    const controlsLink = screen.getByRole('menuitem', { name: /controls/i });
    await userEvent.click(controlsLink);
    expect(screen.getByText(/Controls/i)).toBeInTheDocument();

    // Navigate to Integrations
    const intsLink = screen.getByRole('menuitem', { name: /integrations/i });
    await userEvent.click(intsLink);
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();

    // Navigate to Settings
    const settingsLink = screen.getByRole('menuitem', { name: /settings/i });
    await userEvent.click(settingsLink);
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  test('basic accessibility landmarks present', () => {
    renderWithProviders(<App />, { route: '/' });
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /notifications/i })).toBeInTheDocument();
  });
});
