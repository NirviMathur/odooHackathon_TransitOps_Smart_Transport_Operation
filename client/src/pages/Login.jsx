import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', email, password);
    navigate('/vehicles');
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>

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
        <h2 className="welcome-title">Welcome</h2>
        <span className="accent-line"></span>

        <form onSubmit={handleLogin} noValidate>
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
            <span className="field-label">Your password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <p className="terms-text">
            By signing in you agree to our{' '}
            <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
          </p>

          <button type="submit" className="signin-btn">
            SIGN IN
          </button>

          <p className="switch-line">
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;