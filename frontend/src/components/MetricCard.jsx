import React from 'react';

const MetricCard = ({ title, value, unit, icon }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
          {value} <span style={{ fontSize: '1rem', color: 'var(--accent-teal)' }}>{unit}</span>
        </h3>
      </div>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
    </div>
  );
};

export default MetricCard;