//
// PUBLIC_INTERFACE
// wsMock.js
// Lightweight in-app event bus that simulates websocket topics via publish/subscribe.
//

class EventBus {
  constructor() {
    this.topics = new Map();
  }

  /**
   * PUBLIC_INTERFACE
   * subscribe
   * Subscribes to a topic and returns an unsubscribe function.
   */
  subscribe(topic, handler) {
    if (!topic || typeof handler !== 'function') return () => {};
    if (!this.topics.has(topic)) this.topics.set(topic, new Set());
    const set = this.topics.get(topic);
    set.add(handler);
    return () => {
      set.delete(handler);
    };
  }

  /**
   * PUBLIC_INTERFACE
   * publish
   * Publishes a message to a topic, notifying all subscribers. Payload can be any JSON-serializable value.
   */
  publish(topic, payload) {
    const set = this.topics.get(topic);
    if (!set || set.size === 0) return;
    set.forEach((fn) => {
      try {
        fn(payload);
      } catch (_e) {
        // Swallow handler errors to prevent bus disruption
      }
    });
  }

  /**
   * PUBLIC_INTERFACE
   * clear
   * Clears all subscriptions (used in tests or resets).
   */
  clear() {
    this.topics.clear();
  }
}

export const WS_TOPICS = Object.freeze({
  SENSOR_UPDATES: 'sensor.updates',
  ALERT_NEW: 'alerts.new',
  CONTROLS_STATUS: 'controls.status',
});

export const bus = new EventBus();
