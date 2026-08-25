import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = ({ setTab }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('farmer.john@earthcraft.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.login({ email, password });
      if (res.error) {
        setError(res.error);
      } else {
        login(res);
        if (res.user.role === 'farmer') setTab('farmer-dashboard');
        else if (res.user.role === 'vendor') setTab('vendor-dashboard');
        else setTab('home');
      }
    } catch (err) {
      setError('Connection failed. Make sure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const setPreset = (type) => {
    if (type === 'farmer') {
      setEmail('farmer.john@earthcraft.com');
      setPassword('password123');
    } else {
      setEmail('vendor.sarah@agrimart.com');
      setPassword('password123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Login to access your ECAT Dashboard
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            <LogIn size={18} /> {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Quick Demo Presets:</div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setPreset('farmer')}>
              Preset Farmer
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setPreset('vendor')}>
              Preset Vendor
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('register')}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};
