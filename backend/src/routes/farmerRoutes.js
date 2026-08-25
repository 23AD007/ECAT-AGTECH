const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/profile', authenticateToken, authorizeRoles('farmer', 'admin'), farmerController.getFarmerProfile);
router.put('/profile', authenticateToken, authorizeRoles('farmer', 'admin'), farmerController.updateFarmerProfile);

module.exports = router;
