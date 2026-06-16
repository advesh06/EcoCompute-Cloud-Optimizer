import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Detection = () => {
  const [formData, setFormData] = useState({
    tdp: '65',
    utilization: '45',
    region: 'mumbai',
    hourlyRate: '4.50'
  });

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/detection/calculate', formData);
      setMetrics(response.data);
    } catch (err) {
      console.error("Telemetry math evaluation breakdown:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper styling function for server classifications
  const getBadgeStyle = (cls) => {
    switch(cls) {
      case 'Idle': return { bg: 'rgba(239, 68, 68, 0.1)', fg: '#ef4444', border: '1px solid #ef4444' };
      case 'Underutilized': return { bg: 'rgba(234, 179, 8, 0.1)', fg: '#eab308', border: '1px solid #eab308' };
      case 'Optimal': return { bg: 'rgba(0, 214, 170, 0.1)', fg: '#00d6aa', border: '1px solid #00d6aa' };
      case 'Overloaded': return { bg: 'rgba(249, 115, 22, 0.1)', fg: '#f97316', border: '1px solid #f97316' };
      default: return { bg: '#1f2937', fg: '#94a3b8', border: '1px solid #374151' };
    }
  };

  return (
    <div className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
      <Header title="Telemetry Detection Module" />
      <div className="page-body" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '2rem' }}>
        
        {/* LEFT SIDE: SPECIFICATION FORM INPUTS */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '2rem', borderRadius: '12px', textAlign: 'left' }}>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Resource Characteristics</h3>
          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Power Draw (TDP Watts)</label>
              <input type="number" name="tdp" value={formData.tdp} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>CPU Utilization (%)</label>
              <input type="number" name="utilization" min="0" max="100" value={formData.utilization} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Data Grid Region Location</label>
              <select name="region" value={formData.region} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
                <option value="mumbai">Mumbai (708 gCO₂/kWh)</option>
                <option value="delhi">Delhi (680 gCO₂/kWh)</option>
                <option value="bangalore">Bangalore (620 gCO₂/kWh)</option>
                <option value="chennai">Chennai (600 gCO₂/kWh)</option>
                <option value="stockholm">Stockholm (8 gCO₂/kWh)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Hourly Cost Rate (₹)</label>
              <input type="number" step="0.01" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }} />
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.8rem', backgroundColor: '#00d6aa', color: '#111827', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s' }}>
              {loading ? 'Evaluating Formulas...' : 'Run Diagnostics Engine'}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: REAL-TIME FORMULA EVALUATION METRICS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* SERVER CLASSIFICATION STATUS BANNER */}
          {metrics && (
            <div style={{ 
              backgroundColor: '#111827', border: '1px solid #1f2937', padding: '1.5rem', borderRadius: '12px', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: 0, color: '#fff' }}>Profile Classification Status</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Evaluated resource profile classification bucket mapping.</p>
              </div>
              <span style={{
                padding: '0.5rem 1.5rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase',
                backgroundColor: getBadgeStyle(metrics.classification).bg,
                color: getBadgeStyle(metrics.classification).fg,
                border: getBadgeStyle(metrics.classification).border
              }}>
                {metrics.classification}
              </span>
            </div>
          )}

          {/* MATH OUTPUT CALCULATORS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
            
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>ENERGY CONSUMPTION</span>
              <h2 style={{ margin: 0, color: '#eab308' }}>{metrics ? `${metrics.energyKWh} kWh` : '--'}</h2>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>(TDP × 730 × CPU%) ÷ 100,000</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>CARBON FOOTPRINT</span>
              <h2 style={{ margin: 0, color: '#3b82f6' }}>{metrics ? `${metrics.carbonKg} kg CO₂` : '--'}</h2>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>(Energy × 1.2 × Grid) ÷ 1,000</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', gridColumn: 'span 2' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>ESTIMATED MONTHLY COST</span>
              <h2 style={{ margin: 0, color: '#00d6aa' }}>{metrics ? `₹${metrics.costINR}` : '--'}</h2>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>Hourly Rate × 730 Hours</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Detection;