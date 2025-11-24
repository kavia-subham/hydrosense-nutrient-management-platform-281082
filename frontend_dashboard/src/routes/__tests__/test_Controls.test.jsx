import { screen, fireEvent } from '@testing-library/react';
import Controls from '../Controls';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { getControls, getSensors } from '../../mocks/store';

describe('Controls route', () => {
  test('update targets and manual dosing reflect in mock store', () => {
    renderWithProviders(<Controls />);
    const dosingSelect = screen.getByLabelText(/Dosing pump status/i);
    fireEvent.change(dosingSelect, { target: { value: 'running' } });
    expect(getControls().dosingPump.status).toBe('running');

    const ecDoseInput = screen.getByDisplayValue('5');
    const acidInput = screen.getByDisplayValue('2');
    fireEvent.change(ecDoseInput, { target: { value: '10' } });
    fireEvent.change(acidInput, { target: { value: '4' } });

    const before = getSensors().map((s) => ({ id: s.id, value: s.value }));
    fireEvent.click(screen.getByRole('button', { name: /apply dose/i }));
    const after = getSensors().map((s) => ({ id: s.id, value: s.value }));
    // EC or PH changed
    const changed = after.some((a, i) => a.value !== before[i].value);
    expect(changed).toBe(true);
  });
});
