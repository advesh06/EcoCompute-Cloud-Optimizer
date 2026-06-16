import React from 'react';

const Header = ({ title }) => {
  return (
    <header style={{
      padding: '1.5rem 2rem', 
      borderBottom: '1px solid var(--border-color)', 
      backgroundColor: 'var(--bg-card)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h1>
      <span style={{ color: 'var(--accent-teal)', fontSize: '0.9rem' }}>● System Online</span>
    </header>
  );
};

export default Header;