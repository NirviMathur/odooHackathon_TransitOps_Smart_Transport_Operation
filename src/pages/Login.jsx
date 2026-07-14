import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'FleetManager' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-top">
          <div className="auth-logo">Transit<span>Ops</span></div>
          <Link to="/" className="back-link"><ArrowLeft size={14} /> Back to site</Link>
        </div>
        <div className="auth-side-mid">
          <div className="auth-side-icon"><Truck size={28} /></div>
          <h2>Fleet operations, without the spreadsheets</h2>
          <p>Vehicle registry, dispatch, maintenance, and cost reports — all enforced by the same rules every time.</p>
        </div>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="subtitle">Log in to your TransitOps console</p>

        {mode === 'register' && (
          <>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="FleetManager">Fleet Manager</option>
              <option value="Driver">Driver</option>
              <option value="SafetyOfficer">Safety Officer</option>
              <option value="FinancialAnalyst">Financial Analyst</option>
            </select>
          </>
        )}

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

        {error && <div className="error-banner">{error}</div>}

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}</button>

        <button type="button" className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Log in'}
        </button>

        {mode === 'login' && (
          <p className="hint">Demo: fleet@transitops.com / password123 (after running the seed script)</p>
        )}
      </form>
    </div>
  );
}
