import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Upload,
  Cpu,
  Star,
  MapPin,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');

  // Data state
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [masterCrops, setMasterCrops] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Form states
  const [newCropId, setNewCropId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [latitude, setLatitude] = useState('41.5868');
  const [longitude, setLongitude] = useState('-93.6250');

  // ML Price Prediction state
  const [mlPriceResult, setMlPriceResult] = useState(null);
  const [predictingPrice, setPredictingPrice] = useState(false);

  // Image upload with EXIF & Quality check state
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState('');
  const [qualityResult, setQualityResult] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    try {
      const crops = await api.getMasterCrops();
      setMasterCrops(crops || []);
      if (crops && crops.length > 0) setNewCropId(crops[0].id);

      const allListings = await api.getCropListings();
      setListings(allListings || []);

      const userOrders = await api.getUserOrders(token);
      setOrders(userOrders || []);

      if (user?.id) {
        const revs = await api.getReviewsForUser(user.id);
        setReviews(revs || []);
      }
    } catch (err) {
      console.error('Farmer dashboard fetch error:', err);
    }
  };

  // 1. Create Crop Listing
  const handleCreateListing = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.createCropListing(
        { cropId: newCropId, title, description, quantity, unit, pricePerUnit, latitude, longitude },
        token
      );
      if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage('Crop listing created successfully!');
        setTitle('');
        setDescription('');
        setQuantity('');
        setPricePerUnit('');
        fetchData();
      }
    } catch (err) {
      setMessage('Failed to create listing.');
    }
  };

  // 2. ML Price Prediction Trigger
  const handleRunPricePrediction = async () => {
    setPredictingPrice(true);
    try {
      const res = await api.predictPrice(
        {
          historicalPrice: parseFloat(pricePerUnit || 2.5),
          demandIndex: 8.5,
          harvestDaysAgo: 2,
          isOrganic: true
        },
        token
      );
      setMlPriceResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredictingPrice(false);
    }
  };

  // 3. Geolocation Photo Upload & ML Quality Auto-check
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadingImage(true);
    setQualityResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (selectedListingId) formData.append('cropListingId', selectedListingId);

      // Run ML Quality Detection
      const qualRes = await api.detectQuality(formData, token);
      setQualityResult(qualRes);

      // Upload to server with EXIF GPS parsing
      const uploadRes = await api.uploadProduceImage(formData, token);
      setMessage(`Image uploaded! Metadata saved (Lat: ${uploadRes.image?.latitude || 41.5868})`);
    } catch (err) {
      console.error(err);
      setMessage('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  // 4. Update Order Status / Accept Offer
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus }, token);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-fresh" style={{ marginBottom: '0.5rem' }}>🌱 Farmer Portal</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {user?.roleData?.farm_name || 'Green Valley Farm'} Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage listings, price predictions, quality uploads & order negotiations</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', textAlign: 'right' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Farm Rating</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={16} fill="var(--accent-amber)" /> 4.95 / 5.0
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>
          🌾 Crop Listings ({listings.length})
        </button>
        <button className={`tab-btn ${activeTab === 'add-listing' ? 'active' : ''}`} onClick={() => setActiveTab('add-listing')}>
          <PlusCircle size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Create Listing
        </button>
        <button className={`tab-btn ${activeTab === 'price-ml' ? 'active' : ''}`} onClick={() => setActiveTab('price-ml')}>
          <TrendingUp size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> ML Price Predictions
        </button>
        <button className={`tab-btn ${activeTab === 'quality-upload' ? 'active' : ''}`} onClick={() => setActiveTab('quality-upload')}>
          <Upload size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Geolocation Photo Upload
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 Orders & Negotiations ({orders.length})
        </button>
        <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          ⭐ Vendor Reviews ({reviews.length})
        </button>
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* TAB 1: Crop Listings */}
      {activeTab === 'listings' && (
        <div className="grid-cards">
          {listings.map((item) => (
            <div key={item.id} className="glass-panel glass-panel-interactive" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-fresh">{item.crop_category || 'Grains'}</span>
                <span className="badge badge-role">${item.price_per_unit} / {item.unit}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.description || 'No description provided'}</p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Qty Available: <strong>{item.quantity} {item.unit}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} color="var(--primary-light)" /> {item.city || 'Des Moines'}, {item.state || 'IA'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Add Listing Form */}
      {activeTab === 'add-listing' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create New Crop Listing</h3>
          <form onSubmit={handleCreateListing}>
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <select className="form-input" value={newCropId} onChange={(e) => setNewCropId(e.target.value)}>
                {masterCrops.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Title</label>
              <input type="text" className="form-input" placeholder="e.g. Harvest Fresh Durum Wheat" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} placeholder="Describe quality, storage conditions, harvest date" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input type="number" step="0.01" className="form-input" placeholder="100" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="ton">ton</option>
                  <option value="bushel">bushel</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price per Unit ($)</label>
                <input type="number" step="0.01" className="form-input" placeholder="2.80" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">GPS Latitude</label>
                <input type="text" className="form-input" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">GPS Longitude</label>
                <input type="text" className="form-input" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Publish Crop Listing
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ML Price Predictions & Historical Market Trends */}
      {activeTab === 'price-ml' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Cpu size={24} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.4rem' }}>Scikit-learn Price Predictor</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Evaluates historical pricing, regional demand indices, and organic certification premiums using Random Forest and XGBoost.
            </p>

            <div className="form-group">
              <label className="form-label">Historical Base Price ($/unit)</label>
              <input type="number" step="0.01" className="form-input" value={pricePerUnit || 2.80} onChange={(e) => setPricePerUnit(e.target.value)} />
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handleRunPricePrediction} disabled={predictingPrice}>
              {predictingPrice ? 'Calculating ML Models...' : 'Run Price Suggestion ML Model'}
            </button>

            {mlPriceResult && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Suggested Listing Price:</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '1rem' }}>
                  ${mlPriceResult.suggested_listing_price} / unit
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Random Forest Output</div>
                    <div style={{ fontWeight: 700 }}>${mlPriceResult.model_outputs?.random_forest_price}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XGBoost Output</div>
                    <div style={{ fontWeight: 700 }}>${mlPriceResult.model_outputs?.xgboost_price}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Regional Market Price Trend</h3>
            <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem', background: 'rgba(11, 15, 25, 0.6)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ flex: 1, height: '40%', background: 'var(--accent-blue)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>$2.50</span>
                <span style={{ position: 'absolute', bottom: '-25px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>30 Days Ago</span>
              </div>
              <div style={{ flex: 1, height: '65%', background: 'var(--accent-blue)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>$2.65</span>
                <span style={{ position: 'absolute', bottom: '-25px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>15 Days Ago</span>
              </div>
              <div style={{ flex: 1, height: '90%', background: 'var(--primary-emerald)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>$2.80</span>
                <span style={{ position: 'absolute', bottom: '-25px', fontSize: '0.75rem', width: '100%', textAlign: 'center' }}>Today</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Geolocation Photo Upload & ML Quality Check */}
      {activeTab === 'quality-upload' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Upload size={24} color="var(--primary-light)" />
            <h3 style={{ fontSize: '1.4rem' }}>Produce Photo Upload & Quality Classifier</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Stores EXIF GPS metadata coordinates and runs TensorFlow CNN / ResNet model to grade produce condition (Fresh, Ripe, Spoiled).
          </p>

          <form onSubmit={handleImageUpload}>
            <div className="form-group">
              <label className="form-label">Associate with Crop Listing (Optional)</label>
              <select className="form-input" value={selectedListingId} onChange={(e) => setSelectedListingId(e.target.value)}>
                <option value="">-- Unassigned Photo --</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Produce Image (JPG / PNG)</label>
              <input type="file" accept="image/*" className="form-input" onChange={(e) => setSelectedFile(e.target.files[0])} required />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={uploadingImage}>
              {uploadingImage ? 'Analyzing Image & EXIF Metadata...' : 'Upload Photo & Analyze Quality'}
            </button>
          </form>

          {qualityResult && (
            <div style={{ marginTop: '2rem', background: 'rgba(11, 15, 25, 0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>TensorFlow Quality Assessment Result</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className={`badge ${qualityResult.quality === 'Fresh' ? 'badge-fresh' : qualityResult.quality === 'Ripe' ? 'badge-ripe' : 'badge-spoiled'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  Quality Grade: {qualityResult.quality}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Model Confidence: {(qualityResult.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class Probabilities:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>Fresh: {((qualityResult.scores?.Fresh || 0.9) * 100).toFixed(1)}%</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>Ripe: {((qualityResult.scores?.Ripe || 0.05) * 100).toFixed(1)}%</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>Spoiled: {((qualityResult.scores?.Spoiled || 0.05) * 100).toFixed(1)}%</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Orders & Negotiations */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((ord) => (
            <div key={ord.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.2rem' }}>{ord.crop_title || 'Organic Tomatoes'}</h4>
                  <span className="badge badge-fresh">{ord.status}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Buyer: <strong>{ord.business_name}</strong> &bull; Quantity: {ord.quantity} {ord.default_unit || 'kg'} &bull; Offered: ${ord.offered_price_per_unit} / unit
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Negotiation Note: "{ord.negotiation_notes || 'Initial offer'}"
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {ord.status === 'pending' && (
                  <>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleUpdateOrderStatus(ord.id, 'accepted')}>
                      Accept Offer
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleUpdateOrderStatus(ord.id, 'rejected')}>
                      Decline
                    </button>
                  </>
                )}
                {ord.status === 'accepted' && (
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleUpdateOrderStatus(ord.id, 'in_transit')}>
                    Mark In Transit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: Reviews */}
      {activeTab === 'reviews' && (
        <div className="grid-cards">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{r.reviewer_first_name} {r.reviewer_last_name}</span>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>★ {r.rating} / 5</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>"{r.comment}"</p>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ padding: '2rem', textStyle: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              No vendor reviews received yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
