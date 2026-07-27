const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Record live GPS coordinates for an active delivery order
exports.updateDeliveryGPS = async (req, res) => {
  try {
    const { orderId, latitude, longitude, speedKmh } = req.body;

    if (!orderId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'orderId, latitude, and longitude are required' });
    }

    const gpsId = uuidv4();
    await db.query(
      `INSERT INTO gps_data (id, order_id, latitude, longitude, speed_kmh)
       VALUES ($1, $2, $3, $4, $5)`,
      [gpsId, orderId, parseFloat(latitude), parseFloat(longitude), speedKmh ? parseFloat(speedKmh) : 0.0]
    );

    res.status(201).json({ message: 'GPS coordinates recorded successfully', gpsId });
  } catch (err) {
    console.error('updateDeliveryGPS error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch delivery tracking history for an order
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await db.query(
      `SELECT * FROM gps_data WHERE order_id = $1 ORDER BY timestamp ASC`,
      [orderId]
    );

    const orderRes = await db.query(
      `SELECT o.*, cl.title as crop_title, f.farm_name, v.business_name
       FROM orders o
       JOIN crop_listings cl ON o.crop_listing_id = cl.id
       JOIN farmers f ON o.farmer_id = f.id
       JOIN vendors v ON o.vendor_id = v.id
       WHERE o.id = $1`,
      [orderId]
    );

    res.json({
      order: orderRes.rows[0] || null,
      trackingPoints: result.rows
    });
  } catch (err) {
    console.error('getOrderTracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
