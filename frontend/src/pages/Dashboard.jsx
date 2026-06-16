import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    serversScanned: 0, 
    idleDetected: 0, 
    totalEnergyKWh: 0, 
    totalCarbonKg: 0, 
    totalCostINR: 0, // Listens explicitly to the strict INR variable from backend
    liveCpu: 0 
  });

  useEffect(() => {
    // Function to ping our backend api pipeline
    const fetchLiveMetrics = () => {
      axios.get('http://localhost:5000/api/live-hardware') 
        .then(res => setMetrics(res.data))
        .catch(err => console.error("Error connecting to live server telemetry pipeline:", err));
    };

    // Run it once immediately when the page loads
    fetchLiveMetrics();

    // Set up an automated interval timer to fetch new data every 2000ms (2 seconds)
    const interval = setInterval(fetchLiveMetrics, 2000);

    // Clean up the timer when leaving the dashboard page
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content">
      <Header title="Sustainability Operations Dashboard" />
      <div className="page-body">
        
        {/* Real-time Status Notification Banner */}
        <div style={{ 
          backgroundColor: 'rgba(0, 214, 170, 0.1)', 
          border: '1px solid #00d6aa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem', 
          textAlign: 'center' 
        }}>
          <span style={{ fontWeight: '600', color: '#00d6aa' }}>⚡ Eco-Cloud Live Data Stream Active:</span> Combined network infrastructure environment operating at <strong style={{fontSize: '1.2rem'}}>{metrics.liveCpu}%</strong> average computational load.
        </div>

        <div className="metrics-grid">
          <MetricCard title="Total Instances Ingested" value={metrics.serversScanned} unit="vms" icon="🖥️" />
          <MetricCard title="Idle Inefficiencies Flagged" value={metrics.idleDetected} unit="vms" icon="⚠️" />
          <MetricCard title="Monthly Energy Footprint" value={metrics.totalEnergyKWh} unit="kWh" icon="⚡" />
          <MetricCard title="Carbon Footprint Weight" value={metrics.totalCarbonKg} unit="kg CO₂" icon="☁️" />
          
          {/* Strictly Localized Indian Rupee Card */}
          <MetricCard 
            title="Estimated Operations Cost" 
            value={`₹${metrics.totalCostINR}`} 
            unit="INR" 
            icon="🪙" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;