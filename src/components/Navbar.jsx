import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/vehicles', label: 'Vehicles' },
    { to: '/drivers', label: 'Drivers' },
    { to: '/trips', label: 'Trips' },
    { to: '/maintenance', label: 'Maintenance' },
    { to: '/fuel-expenses', label: 'Fuel & Expenses' },
    { to: '/reports', label: 'Reports' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">TransitOps</div>
      <div className="navbar-links">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="navbar-user">
        <span>{user.name} · {user.role}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
