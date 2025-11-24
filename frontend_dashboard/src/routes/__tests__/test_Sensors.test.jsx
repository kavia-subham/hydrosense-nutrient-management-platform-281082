import { screen, fireEvent } from '@testing-library/react';
import Sensors from '../Sensors';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { getSensors } from '../../mocks/store';

describe('Sensors route', () => {
  test('renders table-like list and opens detail view with history and diagnostics', () => {
    renderWithProviders(<Sensors />);
    const sensors = getSensors();
    const first = sensors[0];
    const btn = screen.getByRole('button', { name: new RegExp(`View details for ${first.name}`, 'i') });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // Health card and history sparkline present
    expect(screen.getByText(new RegExp(`Health`, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('img', { name: new RegExp(`${first.name} detailed history`, 'i') })).toBeInTheDocument();
    // Close button returns to grid-only
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText(/Health/i)).not.toBeInTheDocument();
  });
});
