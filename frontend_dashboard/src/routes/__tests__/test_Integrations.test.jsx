import { screen, fireEvent } from '@testing-library/react';
import Integrations from '../Integrations';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('Integrations route', () => {
  test('add/update/remove connectors display properly', () => {
    renderWithProviders(<Integrations />);
    const nameInput = screen.getByPlaceholderText(/e\.g\., Slack/i);
    fireEvent.change(nameInput, { target: { value: 'Webhook2' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    // Newly added integration appears
    expect(screen.getByText(/Webhook2/i)).toBeInTheDocument();

    // Toggle status
    const toggleBtn = screen.getByRole('button', { name: /toggle status for webhook2/i });
    const currentLabel = toggleBtn.textContent;
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).not.toBe(currentLabel);

    // Remove
    const removeBtn = screen.getByRole('button', { name: /remove webhook2/i });
    fireEvent.click(removeBtn);
    expect(screen.queryByText(/Webhook2/i)).not.toBeInTheDocument();
  });
});
