import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserPlus, AlertCircle } from 'lucide-react';

export const Register = ({ setTab }) => {
  const { login } = useAuth();
  const [role, setRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        role,
        email,
        password,
        firstName,
        lastName,
        farmName: role === 'farmer' ? farmName : undefined,
        businessName: role === 'vendor' ? businessName : undefined
      };
      const res = await api.register(payload);
      if (res.error) {
        setError(res.error);
      } else {
        login(res);
        if (role === 'farmer') setTab('farmer-dashboard');
        else setTab('vendor-dashboard');
      }
    } catch (err) {
      setError('Registration failed. Please check network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join the ECAT Agricultural Network
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="tabs-container" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className={`tab-btn ${role === 'farmer' ? 'active' : ''}`}
            onClick={() => setRole('farmer')}
          >
            🌱 I am a Farmer
          </button>
          <button
            type="button"
            className={`tab-btn ${role === 'vendor' ? 'active' : ''}`}
            onClick={() => setRole('vendor')}
          >
            🏪 I am a Vendor / Buyer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {role === 'farmer' ? (
            <div className="form-group">
              <label className="form-label">Farm / Producer Name</label>
              <input type="text" className="form-input" placeholder="e.g. Sunny Acres Farm" value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Business / Wholesale Name</label>
              <input type="text" className="form-input" placeholder="e.g. AgriMart Distro" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            <UserPlus size={18} /> {submitting ? 'Creating account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Vendor'}`}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('login')}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};
