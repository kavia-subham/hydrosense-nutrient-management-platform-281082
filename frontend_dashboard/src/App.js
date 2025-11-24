import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import ThemeProvider from './components/common/ThemeProvider';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import AlertBanner from './components/common/AlertBanner';
import ToastCenter from './components/common/ToastCenter';
import StoreProvider from './state/StoreProvider';
import { getFeatureFlags } from './utils/featureFlags';

// Route-level code splitting to reduce initial bundle
const Dashboard = lazy(() => import('./routes/Dashboard'));
const Sensors = lazy(() => import('./routes/Sensors'));
const Crops = lazy(() => import('./routes/Crops'));
const Alerts = lazy(() => import('./routes/Alerts'));
const Integrations = lazy(() => import('./routes/Integrations'));
const Settings = lazy(() => import('./routes/Settings'));
const Controls = lazy(() => import('./routes/Controls'));

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
      <StoreProvider>
        <ToastCenter>
          <BrowserRouter>
            <div className="app-shell">
              <Sidebar />
              <main className="main-content" role="main" aria-live="polite">
                <Topbar />
                <div className="content-inner">
                  <AlertBanner type={flags?.maintenance ? 'warning' : 'info'} message={bannerMessage} />
                  <Suspense fallback={<div aria-busy="true">Loading…</div>}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/sensors" element={<Sensors />} />
                      <Route path="/controls" element={<Controls />} />
                      <Route path="/crops" element={<Crops />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Suspense>
                </div>
              </main>
            </div>
          </BrowserRouter>
        </ToastCenter>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
