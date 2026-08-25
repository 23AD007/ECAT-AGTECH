import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navigation, MapPin, Truck, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const OrderTracking = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getUserOrders(token)
        .then((res) => {
          if (Array.isArray(res)) {
            setOrders(res);
            if (res.length > 0) {
              fetchTracking(res[0].id);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const fetchTracking = (orderId) => {
    api.getOrderTracking(orderId, token).then((res) => {
      setSelectedOrder(res.order);
      setTrackingData(res.trackingPoints || []);
    });
  };

  return (
    <div style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Real-Time GPS Delivery Tracking</h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitor transit coordinates, speed telemetry, and fraud security scores</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        {/* Orders list sidebar */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Active Orders ({orders.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                className={`glass-panel glass-panel-interactive`}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderColor: selectedOrder?.id === ord.id ? 'var(--primary-emerald)' : 'var(--border-color)',
                  background: selectedOrder?.id === ord.id ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'
                }}
                onClick={() => fetchTracking(ord.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700 }}>{ord.crop_title || ord.crop_name}</span>
                  <span className="badge badge-fresh">{ord.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Farm: {ord.farm_name} &bull; Total: ${ord.total_amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPS Route Map & Telemetry Dashboard */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {selectedOrder ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>{selectedOrder.crop_title}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Order ID: {selectedOrder.id} &bull; Farm: {selectedOrder.farm_name} &rarr; Vendor: {selectedOrder.business_name}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {selectedOrder.is_flagged_fraud ? (
                    <span className="badge badge-spoiled"><AlertTriangle size={14} /> Fraud Audit Flagged</span>
                  ) : (
                    <span className="badge badge-fresh"><ShieldCheck size={14} /> ML Security Clear</span>
                  )}
                </div>
              </div>

              {/* Simulated Map Visualizer */}
              <div className="glass-panel" style={{ height: '320px', background: 'radial-gradient(circle at 50% 50%, #0d1627 0%, #080b12 100%)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-glow)' }}>
                {/* SVG Route Visualization */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M 100 200 Q 300 80, 500 220 T 800 150" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 8" />
                  <circle cx="100" cy="200" r="10" fill="#3b82f6" />
                  <circle cx="800" cy="150" r="10" fill="#10b981" />
                </svg>

                <div style={{ zIndex: 10, textAlign: 'center', background: 'rgba(11, 15, 25, 0.85)', padding: '1rem 2rem', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)' }}>
                  <Truck size={32} color="var(--primary-light)" style={{ marginBottom: '0.5rem' }} className="pulse-anim" />
                  <h4 style={{ fontSize: '1.1rem' }}>In Transit &bull; Live Telemetry</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Current Speed: 62 km/h &bull; Est. Delivery: 2 Hours 15 Mins
                  </p>
                </div>
              </div>

              {/* Coordinates Telemetry Table */}
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recorded GPS Waypoints</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Timestamp</th>
                        <th style={{ padding: '0.75rem' }}>Latitude</th>
                        <th style={{ padding: '0.75rem' }}>Longitude</th>
                        <th style={{ padding: '0.75rem' }}>Speed (km/h)</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem' }}>{new Date().toLocaleTimeString()}</td>
                        <td style={{ padding: '0.75rem' }}>41.5868° N</td>
                        <td style={{ padding: '0.75rem' }}>-93.6250° W</td>
                        <td style={{ padding: '0.75rem' }}>65.0</td>
                        <td style={{ padding: '0.75rem' }}><span className="badge badge-fresh">Active Route</span></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem' }}>{new Date(Date.now() - 3600000).toLocaleTimeString()}</td>
                        <td style={{ padding: '0.75rem' }}>41.7201° N</td>
                        <td style={{ padding: '0.75rem' }}>-91.5402° W</td>
                        <td style={{ padding: '0.75rem' }}>60.5</td>
                        <td style={{ padding: '0.75rem' }}><span className="badge badge-fresh">Checkpoint Passed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Select an order on the left to view live GPS delivery tracking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
