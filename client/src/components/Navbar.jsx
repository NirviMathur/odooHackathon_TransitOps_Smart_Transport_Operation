import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="app-navbar">
      <div className="navbar-brand">
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M3 7h11v8H3V7z" stroke="#f97316" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M14 10h4l3 3v2h-7v-5z" stroke="#f97316" strokeWidth="1.7" strokeLinejoin="round"/>
          <circle cx="7" cy="17" r="1.6" stroke="#f97316" strokeWidth="1.7"/>
          <circle cx="17.5" cy="17" r="1.6" stroke="#f97316" strokeWidth="1.7"/>
        </svg>
        <span>TransitOps</span>
      </div>
      <div className="navbar-links">
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/drivers">Drivers</Link>
        <Link to="/trips">Trips</Link>
      </div>
    </nav>
  );
}

export default Navbar;