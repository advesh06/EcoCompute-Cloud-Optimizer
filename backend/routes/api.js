const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const dashboardController = require('../controllers/dashboardController');
const detectionController = require('../controllers/detectionController');
const optimizeController = require('../controllers/optimizeController');
const analyticsController = require('../controllers/analyticsController');
const csvController = require('../controllers/csvController');

// --- CORE SYSTEM ROUTE MAPPINGS ---
router.get('/dashboard/summary', dashboardController.getDashboardSummary);

// Supports both POST and GET triggers to avoid path mismatching errors
router.post('/seed-demo', dashboardController.seedDemoDataset);
router.get('/seed-demo', dashboardController.seedDemoDataset);

router.post('/detection/calculate', detectionController.calculateLiveMetrics);

router.get('/optimize', optimizeController.getRecommendations);
router.post('/optimize/apply', optimizeController.applyOptimization);

router.get('/analytics', analyticsController.getAnalyticsTrends);
router.post('/upload', upload.single('file'), csvController.uploadCSV);

module.exports = router;