const express = require('express');
const router = express.Router();
const { predictNextMonthExpense } = require('../services/prediction');

// @route   GET api/predict-expenses
// @desc    Get predicted expenses for the next month
// @access  Public
router.get('/', (req, res) => {
  // In a real app, you would fetch historical data from the database here.
  const historicalData = []; // This would be an array of past expenses
  const prediction = predictNextMonthExpense(historicalData);
  res.json({ prediction });
});

module.exports = router;
