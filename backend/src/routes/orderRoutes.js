const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRoles('vendor', 'admin'), orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.put('/:orderId/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;
