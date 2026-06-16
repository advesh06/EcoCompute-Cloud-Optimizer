import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Landing = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatusMsg({ text: `Selected: ${e.target.files[0].name}`, isError: false });
  };

  // Upload Dataset Feature Pipeline
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatusMsg({ text: 'Please choose a valid CSV file first.', isError: true });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatusMsg({ text: response.data.message, isError: false });
      // Instantly push to dashboard to look at parsed outputs
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Dataset file ingestion failed.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  // Demo Dataset Automated Seed Action
  const handleTriggerDemo = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/seed-demo');
      setStatusMsg({ text: response.data.message, isError: false });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setStatusMsg({ text: 'Error booting operational seed model.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem',
      // Visual Story: Rich organic emerald gradient overlay into deep cloud dark theme
      background: 'radial-gradient(circle at top right, rgba(0, 214, 170, 0.15), transparent), #0b0f19',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      
      {/* Central Visual Showcase Container */}
      <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '4px', color: '#fff', marginBottom: '0.5rem' }}>
          ECOCOMPUTE <span style={{ color: '#00d6aa' }}>CLOUD</span>
        </div>
        <p style={{ fontSize: '1.5rem', fontWeight: '400', color: '#94a3b8', marginBottom: '2rem' }}>
          Greener Infrastructure. Lower Costs.
        </p>
        
        {/* Environmental Impact Story Elements */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1.5rem', 
          backgroundColor: 'rgba(15, 23, 42, 0.6)', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '1px solid #1e293b',
          textAlign: 'left'
        }}>
          <div>
            <h4 style={{ color: '#00d6aa', marginBottom: '0.5rem' }}>🌲 Sustainable Cloud Optimization</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Map processing workloads to carbon intensity profiles natively. Watch resource utilization efficiency trends rise while grid carbon drops.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>📉 Decreasing Carbon, Rising Savings</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Identify idle runtime components across Indian data hubs and apply strict automated scaling limits to protect corporate ROI margins.
            </p>
          </div>
        </div>
      </div>

      {/* Operations Control Hub Panels */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        backgroundColor: '#111827', 
        padding: '2.5rem', 
        borderRadius: '16px', 
        border: '1px solid #1f2937',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
      }}>
        
        {/* Left Side: File Upload Formulation */}
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #374151', paddingRight: '1.5rem' }}>
          <label style={{ display: 'block', padding: '0.8rem 1.5rem', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px dashed #00d6aa', cursor: 'pointer', color: '#00d6aa', fontWeight: '600', marginBottom: '1rem' }}>
            📁 Select CSV/Dataset
            <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#00d6aa', color: '#111827', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Upload Dataset File
          </button>
        </form>

        {/* Right Side: Quick Action Paths */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleTriggerDemo} disabled={loading} style={{ padding: '0.75rem 2rem', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #4b5563', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            💡 Load Demo Dataset
          </button>
          
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 2rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            📊 View Live Dashboard
          </button>
        </div>

      </div>

      {/* Action Notification System Banner */}
      {statusMsg.text && (
        <div style={{
          marginTop: '2rem',
          padding: '0.8rem 2rem',
          borderRadius: '6px',
          fontSize: '0.9rem',
          backgroundColor: statusMsg.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 214, 170, 0.1)',
          border: statusMsg.isError ? '1px solid #ef4444' : '1px solid #00d6aa',
          color: statusMsg.isError ? '#ef4444' : '#00d6aa'
        }}>
          {statusMsg.text}
        </div>
      )}

    </div>
  );
};

export default Landing;