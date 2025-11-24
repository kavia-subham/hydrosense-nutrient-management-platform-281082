import { bus, WS_TOPICS } from '../wsMock';

describe('wsMock EventBus', () => {
  afterEach(() => {
    bus.clear();
  });

  test('subscribe and publish delivers messages', () => {
    const payloads = [];
    const unsub = bus.subscribe(WS_TOPICS.SENSOR_UPDATES, (p) => payloads.push(p));
    bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: 's1', value: 1 });
    bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: 's2', value: 2 });
    expect(payloads).toHaveLength(2);
    expect(payloads[0]).toMatchObject({ id: 's1', value: 1 });
    expect(payloads[1]).toMatchObject({ id: 's2', value: 2 });
    unsub();
    bus.publish(WS_TOPICS.SENSOR_UPDATES, { id: 's3', value: 3 });
    expect(payloads).toHaveLength(2);
  });

  test('publishing to topic with no subscribers is safe', () => {
    expect(() => bus.publish('unknown', { a: 1 })).not.toThrow();
  });
});
