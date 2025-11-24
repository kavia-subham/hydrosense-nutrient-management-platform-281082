import { renderHook, act } from '@testing-library/react';
import { useIntegrations } from '../useIntegrations';
import { getState } from '../../../mocks/store';

describe('useIntegrations', () => {
  test('returns integrations and refresh reflects mutations', () => {
    const { result } = renderHook(() => useIntegrations());
    expect(result.current.loading).toBe(false);
    const before = result.current.integrations.length;
    act(() => {
      const store = getState();
      store.integrations.push({ id: `int-${Date.now()}`, name: 'TestConn', status: 'connected' });
      result.current.refresh();
    });
    expect(result.current.integrations.length).toBeGreaterThanOrEqual(before + 1);
  });
});
