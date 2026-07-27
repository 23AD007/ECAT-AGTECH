import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Store,
  Search,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  DollarSign,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const VendorDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');

  // Marketplace & Search state
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [orders, setOrders] = useState([]);

  // ML Recommendations & LSTM Demand state
  const [recommendations, setRecommendations] = useState([]);
  const [demandForecast, setDemandForecast] = useState(null);

  // Order modal state
  const [orderingListing, setOrderingListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMarketplace();
    fetchOrdersAndML();
  }, [token]);

  const fetchMarketplace = async () => {
    try {
      const res = await api.getCropListings({
        search: searchTerm,
        category: selectedCategory
      });
      setListings(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrdersAndML = async () => {
    if (!token) return;
    try {
      const ords = await api.getUserOrders(token);
      setOrders(ords || []);

      const recs = await api.getRecommendations(token);
      setRecommendations(recs.recommendations || []);

      const demand = await api.forecastDemand({ historicalDemand: [7.5, 7.8, 8.0, 8.2, 8.1, 8.5, 8.7] }, token);
      setDemandForecast(demand);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMarketplace();
  };

  const openOrderModal = (listing) => {
    setOrderingListing(listing);
    setOrderQuantity('100');
    setOfferedPrice(listing.price_per_unit.toString());
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderingListing) return;
    setMessage('');
    try {
      const res = await api.createOrder(
        {
          cropListingId: orderingListing.id,
          quantity: parseFloat(orderQuantity),
          offeredPricePerUnit: parseFloat(offeredPrice),
          notes
        },
        token
      );

      if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage(`Order placed successfully! Transaction security score: ${res.order?.fraudRiskScore}`);
        setOrderingListing(null);
        fetchOrdersAndML();
      }
    } catch (err) {
      setMessage('Failed to place order.');
    }
  };

  return (
    <div style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-role" style={{ marginBottom: '0.5rem' }}>🏪 Vendor Portal</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {user?.roleData?.business_name || 'AgriMart Wholesale'} Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Browse crops, view ML demand forecasts & place secure escrow orders</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vendor License</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)' }}>
            {user?.roleData?.license_number || 'AGRI-IL-984321'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>
          <Store size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Browse Available Crops
        </button>
        <button className={`tab-btn ${activeTab === 'ml-recs' ? 'active' : ''}`} onClick={() => setActiveTab('ml-recs')}>
          <Sparkles size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> ML Recommended Produce ({recommendations.length})
        </button>
        <button className={`tab-btn ${activeTab === 'demand' ? 'active' : ''}`} onClick={() => setActiveTab('demand')}>
          <TrendingUp size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> LSTM Demand Forecast
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <ShoppingCart size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> My Orders ({orders.length})
        </button>
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* TAB 1: Browse Crops Marketplace */}
      {activeTab === 'browse' && (
        <div>
          {/* Search Bar & Category Filters */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 200px 140px', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search produce name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <select className="form-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Grains">Grains</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Legumes">Legumes</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                <Search size={16} /> Search
              </button>
            </form>
          </div>

          <div className="grid-cards">
            {listings.map((item) => (
              <div key={item.id} className="glass-panel glass-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-fresh">{item.crop_category || 'Grains'}</span>
                    <span className="badge badge-role" style={{ fontSize: '0.9rem', padding: '0.3rem 0.6rem' }}>${item.price_per_unit} / {item.unit}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.description || 'Fresh crop listing directly from verified producer.'}</p>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    <div>Producer: <strong>{item.farm_name || 'Green Valley Acres'}</strong></div>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <MapPin size={14} color="var(--primary-light)" /> Location: {item.city || 'Des Moines'}, {item.state || 'IA'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avail: {item.quantity} {item.unit}</span>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => openOrderModal(item)}>
                    <ShoppingCart size={14} /> Place Offer / Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ML Product Recommendations */}
      {activeTab === 'ml-recs' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Personalized ML Recommendations</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Generated based on your past purchases and regional vendor demand preferences</p>
          </div>

          <div className="grid-cards">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="glass-panel glass-panel-interactive" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-ripe"><Sparkles size={14} /> ML Match {(rec.recommendation_score * 100).toFixed(0)}%</span>
                  <span className="badge badge-fresh">{rec.category}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{rec.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Reason: {rec.reason}</p>
                <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => setActiveTab('browse')}>
                  Browse {rec.name} Listings
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LSTM Demand Forecast Visualizer */}
      {activeTab === 'demand' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>TensorFlow LSTM 7-Day Demand Forecast</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Time series sequence prediction integrating regional market demand indices and weather patterns.
            </p>

            {demandForecast && (
              <div>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7-Day Average Demand Index</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>{demandForecast.avg_forecasted_demand} / 10.0</div>
                  </div>
                  <span className="badge badge-fresh">{demandForecast.demand_trend}</span>
                </div>

                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Daily Forecast Breakdown:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                  {demandForecast.forecast_next_7_days?.map((val, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.25rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Day {i + 1}</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.95rem' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Demand & Seasonality Factors</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <li style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>☀️ Weather Temperature Impact</strong>
                Average temp 24.0°C provides optimal harvest delivery conditions.
              </li>
              <li style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>📈 Regional Wholesale Demand</strong>
                Midwest regional procurement index is up +12.4% over last quarter.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: Vendor Orders */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((ord) => (
            <div key={ord.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.2rem' }}>{ord.crop_title || 'Wheat'}</h4>
                  <span className="badge badge-fresh">{ord.status}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Farmer: <strong>{ord.farm_name}</strong> &bull; Total Amount: ${ord.total_amount} &bull; Qty: {ord.quantity} {ord.default_unit || 'kg'}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ML Fraud Audit Score: {ord.fraud_risk_score ? (ord.fraud_risk_score * 100).toFixed(1) + '%' : 'Clean (0.05)'}
                </div>
              </div>

              <div>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => window.location.hash = '#tracking'}>
                  <Truck size={14} /> Track GPS Route
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal Popup */}
      {orderingListing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Place Order / Offer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {orderingListing.title} from {orderingListing.farm_name}
            </p>

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label className="form-label">Order Quantity ({orderingListing.unit})</label>
                <input
                  type="number"
                  className="form-input"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Offered Price per Unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Calculated Total:</span>
                <span style={{ color: 'var(--primary-light)' }}>
                  ${(parseFloat(orderQuantity || 0) * parseFloat(offeredPrice || 0)).toFixed(2)}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Negotiation / Delivery Notes</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Specify delivery timeline or price negotiation terms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Confirm Escrow Order
                </button>
                <button type="button" className="btn-secondary" onClick={() => setOrderingListing(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
