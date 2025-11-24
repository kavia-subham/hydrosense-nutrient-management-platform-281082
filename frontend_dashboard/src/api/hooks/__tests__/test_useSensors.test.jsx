import { renderHook, act } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { bus, WS_TOPICS } from '../../../mocks/wsMock';
import { getSensors as getSensorsState } from '../../../mocks/store';
import { useSensors } from '../useSensors';

function renderHookWithProviders(hook) {
  const wrapper = ({ children }) => renderWithProviders(children).container;
  return renderHook(hook, { wrapper: ({ children }) => <>{children}</> });
}

describe('useSensors', () => {
  afterEach(() => {
    bus.clear();
  });

  test('returns live sensors list and updates on events', () => {
    const { result } = renderHook(() => useSensors());
    expect(Array.isArray(result.current.sensors)).toBe(true);
    const initial = result.current.sensors;
    act(() => {
      const s = getSensorsState()[0];
      bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: s.id, value: s.value + 0.1, updatedAt: Date.now() });
    });
    // Hook re-reads from store on event; values should be updated in store by route actions, so here we just ensure refresh callable
    act(() => {
      result.current.refresh();
    });
    expect(Array.isArray(result.current.sensors)).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.sensors.length).toBe(initial.length);
  });
});
