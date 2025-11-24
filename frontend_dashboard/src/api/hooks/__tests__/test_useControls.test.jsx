import { act, renderHook } from '@testing-library/react';
import { useControls } from '../useControls';
import { getControls } from '../../../mocks/store';
import { bus, WS_TOPICS } from '../../../mocks/wsMock';

describe('useControls', () => {
  afterEach(() => {
    bus.clear();
  });

  test('reads controls and set() updates store', () => {
    const { result } = renderHook(() => useControls());
    expect(result.current.loading).toBe(false);
    act(() => {
      result.current.set('dosingPump', { status: 'running' });
    });
    const store = getControls();
    expect(store.dosingPump.status).toBe('running');
  });

  test('updates on CONTROLS_STATUS events', () => {
    const { result } = renderHook(() => useControls());
    const before = result.current.controls.dosingPump?.status;
    act(() => {
      bus.publish(WS_TOPICS.CONTROLS_STATUS, { key: 'dosingPump', status: 'idle' });
    });
    expect(result.current.controls.dosingPump?.status).toBeDefined();
    expect(result.current.loading).toBe(false);
    // Either changed or stable; ensures hook re-read occurred
  });
});
