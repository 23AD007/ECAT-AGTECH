const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const fetch = require('node-fetch');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Place new order / offer (Vendor)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get vendor record
    const vendorRes = await db.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
    if (vendorRes.rows.length === 0) {
      return res.status(400).json({ error: 'Vendor profile required to place order' });
    }
    const vendorId = vendorRes.rows[0].id;

    const { cropListingId, quantity, offeredPricePerUnit, notes } = req.body;

    if (!cropListingId || !quantity || !offeredPricePerUnit) {
      return res.status(400).json({ error: 'cropListingId, quantity, and offeredPricePerUnit are required' });
    }

    // Get crop listing details
    const listingRes = await db.query('SELECT * FROM crop_listings WHERE id = $1', [cropListingId]);
    if (listingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Crop listing not found' });
    }
    const listing = listingRes.rows[0];

    const farmerId = listing.farmer_id;
    const qty = parseFloat(quantity);
    const price = parseFloat(offeredPricePerUnit);
    const totalAmount = qty * price;
    const orderId = uuidv4();

    // Insert order
    await db.query(
      `INSERT INTO orders (id, crop_listing_id, vendor_id, farmer_id, quantity, offered_price_per_unit, total_amount, status, negotiation_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)`,
      [orderId, cropListingId, vendorId, farmerId, qty, price, totalAmount, notes || 'Initial purchase offer']
    );

    // Call ML Fraud Detection Service
    let isFlagged = false;
    let fraudRiskScore = 0.05;
    try {
      const mlResp = await fetch(`${ML_SERVICE_URL}/api/ml/detect-fraud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          quantity: qty,
          expected_unit_price: parseFloat(listing.price_per_unit),
          distance_km: 25.0
        })
      });
      if (mlResp.ok) {
        const mlData = await mlResp.json();
        isFlagged = mlData.is_flagged_fraud;
        fraudRiskScore = mlData.fraud_risk_score;
      }
    } catch (mlErr) {
      console.log('ML Fraud check fallback notice:', mlErr.message);
    }

    // Record initial escrow transaction record
    const transactionId = uuidv4();
    await db.query(
      `INSERT INTO transactions (id, order_id, payment_method, amount, status, fraud_risk_score, is_flagged_fraud)
       VALUES ($1, $2, 'escrow_card', $3, 'completed', $4, $5)`,
      [transactionId, orderId, totalAmount, fraudRiskScore, isFlagged]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        cropListingId,
        quantity: qty,
        offeredPricePerUnit: price,
        totalAmount,
        status: 'pending',
        fraudRiskScore,
        isFlaggedFraud: isFlagged
      }
    });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ error: 'Server error creating order' });
  }
};

// Update order status or negotiation (Farmer or Vendor)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, negotiationNotes, newOfferedPrice } = req.body;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = orderRes.rows[0];

    let updatedPrice = currentOrder.offered_price_per_unit;
    let updatedTotal = currentOrder.total_amount;

    if (newOfferedPrice) {
      updatedPrice = parseFloat(newOfferedPrice);
      updatedTotal = currentOrder.quantity * updatedPrice;
    }

    await db.query(
      `UPDATE orders
       SET status = COALESCE($1, status),
           negotiation_notes = COALESCE($2, negotiation_notes),
           offered_price_per_unit = $3,
           total_amount = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [status, negotiationNotes, updatedPrice, updatedTotal, orderId]
    );

    // If order delivered, seed sample GPS tracking end
    if (status === 'delivered') {
      await db.query(
        `INSERT INTO gps_data (id, order_id, latitude, longitude, speed_kmh)
         VALUES ($1, $2, 41.8781, -87.6298, 0.0)`,
        [uuidv4(), orderId]
      );
    }

    res.json({ message: `Order updated to ${status || 'negotiating'} successfully` });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ error: 'Server error updating order' });
  }
};

// Get orders list for current logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = `
      SELECT o.*, cl.title as crop_title, c.name as crop_name, c.default_unit,
             f.farm_name, v.business_name,
             t.fraud_risk_score, t.is_flagged_fraud, t.status as payment_status
      FROM orders o
      JOIN crop_listings cl ON o.crop_listing_id = cl.id
      JOIN crops c ON cl.crop_id = c.id
      JOIN farmers f ON o.farmer_id = f.id
      JOIN vendors v ON o.vendor_id = v.id
      LEFT JOIN transactions t ON t.order_id = o.id
    `;

    if (role === 'farmer') {
      query += ` WHERE f.user_id = $1`;
    } else if (role === 'vendor') {
      query += ` WHERE v.user_id = $1`;
    } else {
      query += ` WHERE 1=1`;
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await db.query(query, role === 'admin' ? [] : [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('getUserOrders error:', err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};
