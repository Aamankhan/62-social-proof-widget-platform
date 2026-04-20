import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WidgetProvider } from './contexts/WidgetContext';
import { PreviewProvider } from './contexts/PreviewContext';
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import Dashboard from './pages/Dashboard';
import Widgets from './pages/Widgets';
import Campaigns from './pages/Campaigns';
import Appearance from './pages/Appearance';
import EmbedScript from './pages/EmbedScript';
import Preview from './pages/Preview';
import Settings from './pages/Settings';
// NEW IMPORTS - Add these
import Integrations from './pages/Integrations';
import LiveLogs from './pages/LiveLogs';
import Analytics from './pages/Analytics';

function App() {
  return (
    <WidgetProvider>
      <PreviewProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                <Routes>
                  {/* Existing Routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/widgets" element={<Widgets />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/appearance" element={<Appearance />} />
                  <Route path="/embed" element={<EmbedScript />} />
                  <Route path="/preview" element={<Preview />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* NEW ROUTES - Add these */}
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/live-logs" element={<LiveLogs />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </PreviewProvider>
    </WidgetProvider>
  );
}

export default App;