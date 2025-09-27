const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/recommendations');

// Mock summary data (in a real app, this would come from a database or another service)
const mockSummaryData = {
  income: 5000,
  expense: 2500,
  savings: 2500,
  investments: 10000,
  expensesByCategory: [
    { category: 'Food', amount: 800 },
    { category: 'Transportation', amount: 500 },
    { category: 'Housing', amount: 1000 },
    { category: 'Entertainment', amount: 200 },
  ],
  incomeVsExpenses: [
    { month: 'Jan', income: 4000, expense: 2000 },
    { month: 'Feb', income: 4500, expense: 2200 },
    { month: 'Mar', income: 5000, expense: 2500 },
    { month: 'Apr', income: 5200, expense: 2600 },
    { month: 'May', income: 5500, expense: 2800 },
    { month: 'Jun', income: 5800, expense: 3000 },
  ],
};


// @route   GET api/recommendations
// @desc    Get financial recommendations
// @access  Public
router.get('/', (req, res) => {
  const recommendations = getRecommendations(mockSummaryData);
  res.json(recommendations);
});

module.exports = router;
