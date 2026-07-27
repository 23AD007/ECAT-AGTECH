import React from 'react';
import { Bell, CheckCircle2, TrendingUp, Cpu, ShieldCheck } from 'lucide-react';

export const Notifications = () => {
  const sampleNotifications = [
    {
      id: 1,
      title: 'Order Status Update',
      message: 'Vendor Sarah Miller accepted your price offer for Premium Organic Tomatoes.',
      time: '10 minutes ago',
      icon: <CheckCircle2 size={20} color="var(--primary-light)" />
    },
    {
      id: 2,
      title: 'ML Price Alert',
      message: 'XGBoost price prediction algorithm suggests increasing Wheat price by +4.5% due to high Midwest demand.',
      time: '1 hour ago',
      icon: <TrendingUp size={20} color="var(--accent-blue)" />
    },
    {
      id: 3,
      title: 'Produce Quality Analysis Complete',
      message: 'TensorFlow ResNet model classified listing photo as Fresh (Confidence: 94.2%).',
      time: '3 hours ago',
      icon: <Cpu size={20} color="#a855f7" />
    },
    {
      id: 4,
      title: 'Fraud Audit Verification',
      message: 'Transaction #TX-9842 successfully verified by Isolation Forest anomaly detector.',
      time: '1 day ago',
      icon: <ShieldCheck size={20} color="var(--accent-amber)" />
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Bell size={28} color="var(--primary-light)" />
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Notifications Center</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time updates, negotiation alerts, and ML model outputs</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sampleNotifications.map((n) => (
          <div key={n.id} className="glass-panel glass-panel-interactive" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px' }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{n.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
