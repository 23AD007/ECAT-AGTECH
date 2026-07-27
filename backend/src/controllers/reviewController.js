const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

exports.createReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const { orderId, revieweeId, rating, comment } = req.body;

    if (!orderId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'orderId, revieweeId, and rating are required' });
    }

    const reviewId = uuidv4();
    await db.query(
      `INSERT INTO reviews (id, order_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reviewId, orderId, reviewerId, revieweeId, parseInt(rating), comment || '']
    );

    res.status(201).json({ message: 'Review submitted successfully', reviewId });
  } catch (err) {
    console.error('createReview error:', err);
    res.status(500).json({ error: 'Server error creating review' });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      `SELECT r.*, p.first_name as reviewer_first_name, p.last_name as reviewer_last_name
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE r.reviewee_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('getReviewsForUser error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
