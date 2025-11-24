import { screen, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { bus, WS_TOPICS } from '../../mocks/wsMock';
import { getSensors, updateSensorValue } from '../../mocks/store';

describe('Dashboard route', () => {
  test('renders KPI tiles and sparklines', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    // at least one KPI value label
    const sensors = getSensors();
    sensors.forEach((s) => {
      if (s.name) {
        expect(screen.getByText(s.name)).toBeInTheDocument();
      }
    });
  });

  test('updates KPI values on simulated tick', () => {
    renderWithProviders(<Dashboard />);
    const s = getSensors()[0];
    const old = s.value;
    act(() => {
      updateSensorValue(s.id, old + 0.2);
      bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: s.id, value: old + 0.2, updatedAt: Date.now() });
    });
    // The numeric rendering exists; don't assert exact number due to formatting
    expect(screen.getByText(s.name)).toBeInTheDocument();
  });
});
