import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Optimize = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = () => {
    axios.get('http://localhost:5000/api/optimize')
      .then(res => setItems(res.data))
      .catch(err => console.error("Error pulling optimization roadmap:", err));
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleApplyOptimization = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/optimize/apply');
      setSummary(response.data.metrics);
      fetchRecommendations(); // Sync updated dashboard statuses
    } catch (err) {
      console.error("Error executing optimization pipeline updates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ flex: 1, padding: '2rem' }}>
      <Header title="Automated Resource Optimization Engine" />
      <div className="page-body">
        
        {/* Action Call Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#00d6aa', marginBottom: '0.25rem' }}>Active System Efficiency Policies</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Scans data workloads against strict CPU utilization buckets to calculate waste reduction deltas.</p>
          </div>
          <button onClick={handleApplyOptimization} disabled={loading || items.length === 0} style={{ padding: '0.75rem 2rem', backgroundColor: '#00d6aa', color: '#111827', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            {loading ? 'Processing System Actions...' : 'Apply Optimization Strategy'}
          </button>
        </div>

        {/* POST-OPTIMIZATION DELTA METRICS AUDIT OVERVIEW */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(0, 214, 170, 0.05)', border: '1px solid #00d6aa', padding: '1.2rem', borderRadius: '10px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Monthly Financial Savings</span>
              <h2 style={{ color: '#00d6aa', margin: 0 }}>₹{summary.monthlySavingsINR}</h2>
            </div>
            <div style={{ backgroundColor: 'rgba(0, 214, 170, 0.05)', border: '1px solid #00d6aa', padding: '1.2rem', borderRadius: '10px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Projected Annual Savings</span>
              <h2 style={{ color: '#00d6aa', margin: 0 }}>₹{summary.annualSavingsINR}</h2>
            </div>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', padding: '1.2rem', borderRadius: '10px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Carbon Mass Reduction</span>
              <h2 style={{ color: '#3b82f6', margin: 0 }}>{summary.co2ReductionKg} <span style={{fontSize:'0.9rem'}}>kg CO₂</span></h2>
            </div>
            <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.05)', border: '1px solid #eab308', padding: '1.2rem', borderRadius: '10px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Energy Overhead Saved</span>
              <h2 style={{ color: '#eab308', margin: 0 }}>{summary.energyReductionKWh} <span style={{fontSize:'0.9rem'}}>kWh</span></h2>
            </div>
          </div>
        )}

        {/* Dynamic Profiling Audit Table */}
        <div style={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#1f2937', color: '#94a3b8', borderBottom: '1px solid #374151' }}>
                <th style={{ padding: '1rem' }}>Cloud Instance Name</th>
                <th style={{ padding: '1rem' }}>Region</th>
                <th style={{ padding: '1rem' }}>CPU Utilization</th>
                <th style={{ padding: '1rem' }}>Current Cost</th>
                <th style={{ padding: '1rem' }}>Engine Recommendation</th>
                <th style={{ padding: '1rem' }}>Target Yield</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No live infrastructure dataset records mapped. Please load data on the homepage first.</td>
                </tr>
              ) : (
                items.map((node) => (
                  <tr key={node._id} style={{ borderBottom: '1px solid #1f2937', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{node.serverName}</td>
                    <td style={{ padding: '1rem', textTransform: 'uppercase', color: '#3b82f6' }}>{node.region}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                        backgroundColor: node.classification === 'Idle' ? 'rgba(239, 68, 68, 0.1)' : node.classification === 'Underutilized' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(0, 214, 170, 0.1)',
                        color: node.classification === 'Idle' ? '#ef4444' : node.classification === 'Underutilized' ? '#eab308' : '#00d6aa'
                      }}>
                        {node.cpuUtilization}% ({node.classification})
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>₹{node.currentCostINR}</td>
                    <td style={{ padding: '1rem', color: node.savingsPercent > 0 ? '#00d6aa' : '#94a3b8', fontWeight: '500' }}>{node.recommendation}</td>
                    <td style={{ padding: '1rem', color: '#00d6aa', fontWeight: '600' }}>{node.savingsPercent > 0 ? `-${node.savingsPercent}%` : 'Stable'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Optimize;