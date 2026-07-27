import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, LogOut, Bell, Navigation, Store, LayoutDashboard } from 'lucide-react';

export const Navbar = ({ currentTab, setTab }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setTab('home')}>
        <div className="nav-brand-icon">
          <Sprout size={24} />
        </div>
        <div>
          <span>ECAT</span>
          <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 400 }}>
            Earth Craft AgTech
          </span>
        </div>
      </div>

      <div className="nav-links">
        <button className={`nav-btn ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
          Home
        </button>

        <button className={`nav-btn ${currentTab === 'marketplace' ? 'active' : ''}`} onClick={() => setTab('marketplace')}>
          <Store size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Browse Crops
        </button>

        {user && (
          <>
            {user.role === 'farmer' && (
              <button className={`nav-btn ${currentTab === 'farmer-dashboard' ? 'active' : ''}`} onClick={() => setTab('farmer-dashboard')}>
                <LayoutDashboard size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Farmer Dashboard
              </button>
            )}

            {user.role === 'vendor' && (
              <button className={`nav-btn ${currentTab === 'vendor-dashboard' ? 'active' : ''}`} onClick={() => setTab('vendor-dashboard')}>
                <LayoutDashboard size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Vendor Dashboard
              </button>
            )}

            <button className={`nav-btn ${currentTab === 'tracking' ? 'active' : ''}`} onClick={() => setTab('tracking')}>
              <Navigation size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Order Tracking
            </button>

            <button className={`nav-btn ${currentTab === 'notifications' ? 'active' : ''}`} onClick={() => setTab('notifications')}>
              <Bell size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Notifications
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.email}</div>
              <span className="badge badge-role">{user.role}</span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.5rem 0.75rem' }} onClick={logout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => setTab('login')}>Login</button>
            <button className="btn-primary" onClick={() => setTab('register')}>Register</button>
          </div>
        )}
      </div>
    </nav>
  );
};
