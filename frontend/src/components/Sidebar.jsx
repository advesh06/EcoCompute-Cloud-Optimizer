import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🌿</span> Eco-Compute
      </div>
      <nav className="sidebar-menu">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/detection" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          ⚡ Live Detection
        </NavLink>
        <NavLink to="/optimize" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          🛠️ Optimize Resources
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          📈 Analytics
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;