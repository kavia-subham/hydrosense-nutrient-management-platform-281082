import React from 'react';
import Card from '../components/common/Card';

export default function Settings() {
  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Settings</h2>
      <Card title="Preferences">General application settings.</Card>
    </div>
  );
}
