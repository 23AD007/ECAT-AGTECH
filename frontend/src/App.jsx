import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { OrderTracking } from './pages/OrderTracking';
import { Notifications } from './pages/Notifications';
import { Sprout, Heart } from 'lucide-react';

const MainContent = () => {
  const { user } = useAuth();
  const [currentTab, setTab] = useState('home');

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home setTab={setTab} />;
      case 'login':
        return <Login setTab={setTab} />;
      case 'register':
        return <Register setTab={setTab} />;
      case 'farmer-dashboard':
        return user ? <FarmerDashboard /> : <Login setTab={setTab} />;
      case 'vendor-dashboard':
      case 'marketplace':
        return user ? <VendorDashboard /> : <Login setTab={setTab} />;
      case 'tracking':
        return <OrderTracking />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Home setTab={setTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentTab={currentTab} setTab={setTab} />
      
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 4rem', background: 'rgba(11, 15, 25, 0.95)', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sprout size={18} color="var(--primary-light)" />
          <strong style={{ color: 'var(--text-main)' }}>ECAT (Earth Craft AgTech) Platform</strong>
        </div>
        <p>Full-Stack Agricultural Marketplace with AI Quality Detection, ML Price Prediction, LSTM Demand Forecasting, and GPS Tracking.</p>
        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Powered by React.js, Express, PostgreSQL, TensorFlow & Scikit-learn
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
