import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import ThemeProvider from './components/common/ThemeProvider';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import AlertBanner from './components/common/AlertBanner';

import Dashboard from './routes/Dashboard';
import Sensors from './routes/Sensors';
import Crops from './routes/Crops';
import Alerts from './routes/Alerts';
import Integrations from './routes/Integrations';
import Settings from './routes/Settings';
import { getFeatureFlags } from './utils/featureFlags';

/**
 * PUBLIC_INTERFACE
 * App
 * Application shell rendering layout, theme, routing, and alert banner placeholder.
 */
function App() {
  const flags = getFeatureFlags();
  const bannerMessage =
    flags?.maintenance
      ? 'The system will undergo maintenance tonight at 11 PM UTC.'
      : 'Welcome to HydroSense — optimizing nutrient management with elegance.';

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">
            <Topbar />
            <div className="content-inner">
              <AlertBanner type={flags?.maintenance ? 'warning' : 'info'} message={bannerMessage} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sensors" element={<Sensors />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
