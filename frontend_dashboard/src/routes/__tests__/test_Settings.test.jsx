import { screen, fireEvent } from '@testing-library/react';
import Settings from '../Settings';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('Settings route', () => {
  beforeEach(() => {
    // isolate storage per test
    const store = {};
    jest.spyOn(window, 'localStorage', 'get').mockReturnValue({
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('toggling preferences persists to localStorage and affects UI', () => {
    renderWithProviders(<Settings />);
    const units = screen.getByLabelText(/Units/i);
    fireEvent.change(units, { target: { value: 'imperial' } });
    const liveToggle = screen.getByLabelText(/Enable live updates/i);
    fireEvent.click(liveToggle);
    // Force re-render to read saved prefs
    renderWithProviders(<Settings />);
    // Values should be as set (imperial and false)
    expect(screen.getByLabelText(/Units/i)).toHaveValue('imperial');
  });
});
