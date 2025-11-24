import React from 'react';
import Card from '../components/common/Card';

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Dashboard</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        <Card title="Live Status">Live sensors and KPIs will appear here.</Card>
        <Card title="Recent Alerts">Summaries of latest alerts and system health.</Card>
        <Card title="Quick Actions">Common tasks to manage systems and crops.</Card>
      </div>
    </div>
  );
}
