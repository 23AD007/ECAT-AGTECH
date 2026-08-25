const express = require('express');
const router = express.Router();
const gpsController = require('../controllers/gpsController');
const { authenticateToken } = require('../middleware/auth');

router.post('/tracking', authenticateToken, gpsController.updateDeliveryGPS);
router.get('/tracking/:orderId', authenticateToken, gpsController.getOrderTracking);

module.exports = router;
