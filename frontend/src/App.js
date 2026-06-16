import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing'; // Added your new Sustainable Homepage!
import Dashboard from './pages/Dashboard';
import Detection from './pages/Detection';
import Optimize from './pages/Optimize';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff' }}>
        <Sidebar />
        <Routes>
          {/* Landing Page is now your central entryway */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;