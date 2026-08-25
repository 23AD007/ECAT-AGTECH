const express = require('express');
const router = express.Router();
const multer = require('multer');
const cropController = require('../controllers/cropController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/master', cropController.getMasterCrops);
router.get('/listings', cropController.getAllListings);
router.get('/listings/:id', cropController.getListingById);

router.post('/listings', authenticateToken, authorizeRoles('farmer', 'admin'), cropController.createCropListing);
router.post('/upload-image', authenticateToken, upload.single('image'), cropController.uploadProduceImage);

module.exports = router;
