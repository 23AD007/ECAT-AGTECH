const getHeaders = (token, isFormData = false) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Auth
  login: (credentials) =>
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then((res) => res.json()),

  register: (userData) =>
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then((res) => res.json()),

  // Farmer & Vendor Profiles
  getFarmerProfile: (token) =>
    fetch('/api/farmers/profile', { headers: getHeaders(token) }).then((res) => res.json()),

  getVendorProfile: (token) =>
    fetch('/api/vendors/profile', { headers: getHeaders(token) }).then((res) => res.json()),

  // Crops & Marketplace
  getMasterCrops: () => fetch('/api/crops/master').then((res) => res.json()),

  getCropListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/crops/listings?${query}`).then((res) => res.json());
  },

  createCropListing: (listingData, token) =>
    fetch('/api/crops/listings', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(listingData)
    }).then((res) => res.json()),

  uploadProduceImage: (formData, token) =>
    fetch('/api/crops/upload-image', {
      method: 'POST',
      headers: getHeaders(token, true),
      body: formData
    }).then((res) => res.json()),

  // Orders
  createOrder: (orderData, token) =>
    fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData)
    }).then((res) => res.json()),

  getUserOrders: (token) =>
    fetch('/api/orders', { headers: getHeaders(token) }).then((res) => res.json()),

  updateOrderStatus: (orderId, statusData, token) =>
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(statusData)
    }).then((res) => res.json()),

  // Live Delivery Tracking
  getOrderTracking: (orderId, token) =>
    fetch(`/api/gps/tracking/${orderId}`, { headers: getHeaders(token) }).then((res) => res.json()),

  // ML Endpoints
  predictPrice: (payload, token) =>
    fetch('/api/ml/predict-price', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    }).then((res) => res.json()),

  forecastDemand: (payload, token) =>
    fetch('/api/ml/demand-forecast', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    }).then((res) => res.json()),

  getRecommendations: (token) =>
    fetch('/api/ml/recommendations', {
      method: 'POST',
      headers: getHeaders(token)
    }).then((res) => res.json()),

  detectQuality: (formData, token) =>
    fetch('/api/ml/quality', {
      method: 'POST',
      headers: getHeaders(token, true),
      body: formData
    }).then((res) => res.json()),

  getMarketTrends: (cropId) =>
    fetch(`/api/ml/market-trends${cropId ? `?cropId=${cropId}` : ''}`).then((res) => res.json()),

  getPipelineMetrics: () => fetch('/api/ml/pipeline-metrics').then((res) => res.json()),

  // Reviews
  createReview: (reviewData, token) =>
    fetch('/api/reviews', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(reviewData)
    }).then((res) => res.json()),

  getReviewsForUser: (userId) =>
    fetch(`/api/reviews/user/${userId}`).then((res) => res.json())
};
