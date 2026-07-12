import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
      navigate('/vehicles');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-bg-overlay"></div>

      <div className="brand-corner">
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none">
          <path d="M3 7h11v8H3V7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M14 10h4l3 3v2h-7v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="17.5" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
        <span className="brand-name">TransitOps</span>
      </div>

      <div className="glass-card">
        <h2 className="welcome-title">Create account</h2>
        <span className="accent-line"></span>

        <form onSubmit={handleSignup} noValidate>
          {error && <p className="error-text">{error}</p>}

          <label className="field">
            <span className="field-label">Your name</span>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Your email</span>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Confirm password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          <p className="terms-text">
            By signing up you agree to our{' '}
            <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
          </p>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>

          <p className="switch-line">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;