import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/api';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
<<<<<<< HEAD
        {user && <span className="navbar-user">{user.name}</span>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
=======
        <Link to="/trips">Trips</Link>
>>>>>>> bb29c9ac95232bb33178158897c349599768cf45
      </div>
    </nav>
  );
}

export default Navbar;