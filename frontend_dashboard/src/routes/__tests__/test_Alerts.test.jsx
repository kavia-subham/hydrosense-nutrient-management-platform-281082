import { screen, fireEvent } from '@testing-library/react';
import Alerts from '../Alerts';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { pushAlert, getAlerts } from '../../mocks/store';

describe('Alerts route', () => {
  test('filters by severity/status and acknowledge updates UI', () => {
    // Seed alerts
    pushAlert({ title: 'Critical Temp', severity: 'warning', message: 'hot' });
    pushAlert({ title: 'FYI Drift', severity: 'info', message: 'drift' });

    renderWithProviders(<Alerts />);

    // filter by info
    const severitySelect = screen.getByLabelText(/filter by severity/i);
    fireEvent.change(severitySelect, { target: { value: 'info' } });
    expect(screen.getByText(/FYI Drift/i)).toBeInTheDocument();
    // ensure others filtered
    expect(screen.queryByText(/Critical Temp/i)).not.toBeInTheDocument();

    // show acknowledged toggle
    const toAck = getAlerts().find((a) => a.severity === 'info');
    const ackBtn = screen.getByRole('button', { name: /acknowledge/i });
    fireEvent.click(ackBtn);
    // If item re-renders, acknowledged label should appear or item removed based on filter
    expect(screen.getByText(/Acknowledged/i)).toBeInTheDocument();
  });
});
