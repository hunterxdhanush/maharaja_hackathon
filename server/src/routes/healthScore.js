const express = require('express');
const router = express.Router();
const { calculateHealthScore } = require('../services/healthScore');

// Mock summary data (in a real app, this would come from a database or another service)
const mockSummaryData = {
  income: 5000,
  expense: 2500,
  savings: 2500,
  investments: 10000,
};


// @route   GET api/health-score
// @desc    Get financial health score
// @access  Public
router.get('/', (req, res) => {
  const score = calculateHealthScore(mockSummaryData);
  res.json({ score });
});

module.exports = router;
