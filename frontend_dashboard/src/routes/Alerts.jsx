import React from 'react';
import Card from '../components/common/Card';

export default function Alerts() {
  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Alerts</h2>
      <Card title="Alert Feed">Active and historical alerts.</Card>
    </div>
  );
}
