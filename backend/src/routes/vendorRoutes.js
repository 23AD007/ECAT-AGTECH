const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/profile', authenticateToken, authorizeRoles('vendor', 'admin'), vendorController.getVendorProfile);
router.put('/profile', authenticateToken, authorizeRoles('vendor', 'admin'), vendorController.updateVendorProfile);

module.exports = router;
