import { screen, fireEvent } from '@testing-library/react';
import Crops from '../Crops';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { getCrops } from '../../mocks/store';

describe('Crops route', () => {
  test('renders crop list from mock store and filters by search', () => {
    const all = getCrops();
    expect(all.length).toBeGreaterThan(0);

    renderWithProviders(<Crops />);

    // All or some crops should render names
    const first = all[0];
    expect(screen.getByText(first.name)).toBeInTheDocument();

    // Search narrows results
    const input = screen.getByLabelText(/search crops/i);
    fireEvent.change(input, { target: { value: first.name.slice(0, 4) } });
    expect(screen.getByText(first.name)).toBeInTheDocument();

    // Search for a non-existing term
    fireEvent.change(input, { target: { value: '___notfound___' } });
    expect(screen.getByText(/no crop profiles match/i)).toBeInTheDocument();
  });
});
