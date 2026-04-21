import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, CalendarCheck, LayoutDashboard, Wrench } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/facilities', label: 'Facilities', icon: Building2 },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/incidents', label: 'Maintenance', icon: Wrench },
];

const Navbar = () => {
  return (
    <nav className="app-nav">
      <div className="brand-block">
        <span className="brand-mark">SC</span>
        <div>
          <strong>Smart Campus Hub</strong>
          <p>PAF Module Navigator</p>
        </div>
      </div>

      <div className="nav-links">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
