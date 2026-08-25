const express = require('express');
const router = express.Router();
const multer = require('multer');
const mlController = require('../controllers/mlController');
const { authenticateToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/quality', authenticateToken, upload.single('image'), mlController.detectQuality);
router.post('/predict-price', authenticateToken, mlController.predictPrice);
router.post('/demand-forecast', authenticateToken, mlController.forecastDemand);
router.post('/recommendations', authenticateToken, mlController.recommendProducts);
router.post('/detect-fraud', authenticateToken, mlController.detectFraud);
router.get('/market-trends', mlController.getMarketTrends);
router.get('/pipeline-metrics', mlController.getPipelineMetrics);

module.exports = router;
