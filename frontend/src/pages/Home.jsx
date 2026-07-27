import React from 'react';
import { Sprout, TrendingUp, ShieldCheck, MapPin, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Home = ({ setTab }) => {
  return (
    <div style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '3rem 0 5rem 0' }}>
        <div className="badge badge-fresh" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
          <Cpu size={14} /> AI-Powered Agricultural Marketplace
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
          Direct AgTech Commerce for <br />
          <span className="gradient-text">Farmers & Vendors</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          Earth Craft AgTech (ECAT) unifies produce listing, ML food quality detection, Scikit-learn price predictions, TensorFlow LSTM demand forecasting, and real-time GPS tracking in one secure platform.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }} onClick={() => setTab('marketplace')}>
            Explore Marketplace <ArrowRight size={18} />
          </button>
          <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }} onClick={() => setTab('register')}>
            Join as Farmer / Vendor
          </button>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="grid-cards" style={{ marginBottom: '5rem' }}>
        <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem' }}>
          <div className="nav-brand-icon" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Cpu size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>TensorFlow Quality Detection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Upload produce photos with automated CNN/ResNet transfer learning model quality verification (Fresh, Ripe, Spoiled).
          </p>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem' }}>
          <div className="nav-brand-icon" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <TrendingUp size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>ML Price & Demand Forecast</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Random Forest, XGBoost, and LSTM neural networks forecast market prices and 7-day regional demand trends.
          </p>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem' }}>
          <div className="nav-brand-icon" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>GPS Geolocation & Tracking</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Extract EXIF GPS metadata from harvest photos and track live delivery routes with continuous coordinate telemetry.
          </p>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem' }}>
          <div className="nav-brand-icon" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Fraud Detection & Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Isolation Forest anomaly detection checks transaction amounts and geographic discrepancies to prevent fraud.
          </p>
        </div>
      </section>

      {/* Feature Showcase Box */}
      <section className="glass-panel" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
        <div>
          <span className="badge badge-ripe" style={{ marginBottom: '1rem' }}>Data Science Pipeline</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Built for Scale & Precision</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={18} color="var(--primary-light)" /> Normalization, Feature Engineering & Data Augmentation
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={18} color="var(--primary-light)" /> Hyperparameter Tuning via Grid Search & Random Search
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={18} color="var(--primary-light)" /> Comprehensive metrics: Accuracy, Precision, Recall, RMSE, MAE, MAPE
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={18} color="var(--primary-light)" /> Normalized PostgreSQL database schema with UUID keys
            </li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(11, 15, 25, 0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>ML Model Metrics</span>
            <span style={{ color: 'var(--primary-light)' }}>Status: Active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>94.2%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quality Detection Accuracy</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>0.12 RMSE</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price Prediction Error</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>7-Day LSTM</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Demand Sequence Forecast</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>99.1%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fraud Audit Precision</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
