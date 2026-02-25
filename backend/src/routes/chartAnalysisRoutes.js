const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { analyzeChart } = require('../controllers/chartAnalysisController');

// Apply authentication middleware to the route
router.post('/analyze', authenticate, analyzeChart);

module.exports = router;
