import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/analytics')
      .then(res => {
        console.log("Analytics Backend Payload Received:", res.data);
        // Explicit structural safeguard check
        if (res.data && res.data.success && res.data.top5Highest && res.data.top5Highest.length > 0) {
          setData(res.data);
        } else {
          console.warn("Database response returned success but collection arrays are empty.");
          setData(null);
        }
      })
      .catch(err => {
        console.error("Critical connection failure to analytics pipeline API:", err);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="main-content" style={{ flex: 1, padding: '2rem' }}>
        <Header title="EcoCompute Executive Infrastructure Intelligence" />
        <p style={{ color: 'var(--accent-teal)', marginTop: '2rem' }}>Synchronizing analytical telemetry datastores...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="main-content" style={{ flex: 1, padding: '2rem' }}>
        <Header title="EcoCompute Executive Infrastructure Intelligence" />
        <div style={{ padding: '2rem', backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #ef4444', marginTop: '2rem', textAlign: 'left' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ Data Sync Notice</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
            No active operational cloud data metrics are currently detected inside your database. 
            Please return to the <strong style={{ color: '#00d6aa' }}>Homepage</strong> view, click on the 
            <strong> "Load Demo Dataset"</strong> action button to seed your infrastructure models, and then re-open this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '100vh' }}>
      <Header title="EcoCompute Executive Infrastructure Intelligence" />
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
        
        {/* AUTOMATED AI INSIGHTS PANEL MODULE */}
        <div style={{ backgroundColor: 'rgba(0, 214, 170, 0.04)', border: '1px solid #00d6aa', borderRadius: '12px', padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ color: '#00d6aa', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧠 Automated AI Insights Engine
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.aiInsights && data.aiInsights.map((insight, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                <span style={{ color: '#00d6aa' }}>⚡</span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI SUMMARY CARD DECK */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '10px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Potential Monthly Savings Target</span>
            <h2 style={{ color: '#00d6aa', margin: 0 }}>₹{data.summary?.monthlySavings}</h2>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '10px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Projected Annual ROI Acceleration</span>
            <h2 style={{ color: '#00d6aa', margin: 0 }}>₹{data.summary?.annualSavings}</h2>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '10px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Net Carbon Abatement Capacity</span>
            <h2 style={{ color: '#3b82f6', margin: 0 }}>{data.summary?.carbonSaved} kg CO₂</h2>
          </div>
        </div>

        {/* CHART VISUALIZATION ROW 1: ENERGY CONSUMERS COMPARISON */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '12px', height: '300px' }}>
            <h4 style={{ marginBottom: '1rem', color: '#ef4444', textAlign: 'left' }}>Top 5 Energy Consumers (kWh)</h4>
            <div style={{ width: '100%', height: '85%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top5Highest}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '12px', height: '300px' }}>
            <h4 style={{ marginBottom: '1rem', color: '#00d6aa', textAlign: 'left' }}>Top 5 Lowest Energy Consumers (kWh)</h4>
            <div style={{ width: '100%', height: '85%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top5Lowest}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                  <Bar dataKey="value" fill="#00d6aa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CHART VISUALIZATION ROW 2: BEFORE VS AFTER OPTIMIZATION TRENDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '12px', height: '280px' }}>
            <h4 style={{ marginBottom: '1rem', color: '#eab308', textAlign: 'left' }}>Cost Optimizations Delta Trend (₹)</h4>
            <div style={{ width: '100%', height: '80%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.costTrend}>
                  <CartesianGrid stroke="#1f2937" />
                  <XAxis dataKey="timeline" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827' }} />
                  <Line type="monotone" dataKey="Cost" stroke="#eab308" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '12px', height: '280px' }}>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6', textAlign: 'left' }}>CO₂ Emission Minimization Curve (kg)</h4>
            <div style={{ width: '100%', height: '80%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.carbonTrend}>
                  <CartesianGrid stroke="#1f2937" />
                  <XAxis dataKey="timeline" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827' }} />
                  <Line type="monotone" dataKey="Carbon" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* REGIONAL MATRIX BREAKDOWN TABLE */}
        <div style={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937', padding: '1.5rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Geographic Regional Cloud Comparison Grid</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2937', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Data Grid Node Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Active Instances Mapped</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Accumulated Operational Overhead</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Gross Carbon Mass Generated</th>
              </tr>
            </thead>
            <tbody>
              {data.regionData && data.regionData.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase' }}>{row.region}</td>
                  <td style={{ padding: '0.75rem' }}>{row.count} server(s)</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500', color: '#00d6aa' }}>₹{row.currentCost?.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', color: '#ef4444' }}>{row.currentCarbon?.toFixed(2)} kg CO₂</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Analytics;