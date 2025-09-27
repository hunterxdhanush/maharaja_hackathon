const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finance',
  password: 'qwezxcasd',
  port: 5432,
});

function calculateNextMonthPrediction(expenses) {
  if (!expenses || expenses.length === 0) {
    return 0;
  }

  // Calculate weighted average of last 3 months
  const weights = [0.5, 0.3, 0.2]; // Most recent month has highest weight
  let prediction = 0;
  
  for (let i = 0; i < Math.min(3, expenses.length); i++) {
    prediction += expenses[expenses.length - 1 - i] * weights[i];
  }

  return prediction;
}

// @route   GET api/predict
// @desc    Predict next month's expense
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get last 6 months of expenses with their months
    const expensesQuery = await pool.query(
      `SELECT 
        DATE_TRUNC('month', transaction_date) as month,
        COALESCE(SUM(amount), 0) as total_expense
       FROM transactions 
       WHERE user_id = $1 AND type = 'expense' 
       GROUP BY DATE_TRUNC('month', transaction_date)
       ORDER BY DATE_TRUNC('month', transaction_date) DESC 
       LIMIT 6`,
      [user_id]
    );

    if (expensesQuery.rows.length === 0) {
      return res.json({ 
        prediction: '0.00',
        message: 'No expense history available'
      });
    }

    const expenses = expensesQuery.rows.map(row => ({
      month: row.month,
      amount: parseFloat(row.total_expense)
    })).reverse();

    // Calculate trend
    let trend = 0;
    if (expenses.length >= 2) {
      const firstAmount = expenses[0].amount;
      const lastAmount = expenses[expenses.length - 1].amount;
      trend = (lastAmount - firstAmount) / expenses.length;
    }

    // Calculate average monthly expense
    const average = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;

    // Get the most recent expense
    const lastExpense = expenses[expenses.length - 1].amount;

    // Calculate predicted expense
    let prediction;
    if (expenses.length >= 3) {
      // Use trend and average for prediction
      prediction = lastExpense + trend;
      
      // Adjust prediction based on historical variance
      const variance = Math.sqrt(
        expenses.reduce((sum, exp) => sum + Math.pow(exp.amount - average, 0), 0) / expenses.length
      );
      
      // Ensure prediction doesn't deviate too much from recent history
      const maxDeviation = 0.2; // 20% maximum deviation
      const upperLimit = lastExpense * (1 + maxDeviation);
      const lowerLimit = lastExpense * (1 - maxDeviation);
      
      prediction = Math.min(Math.max(prediction, lowerLimit), upperLimit);
    } else {
      // Not enough data, use simple projection
      prediction = lastExpense * 1.1; // Assume 10% increase
    }

    res.json({ 
      prediction: prediction.toFixed(2),
      trend: trend.toFixed(2),
      average: average.toFixed(2),
      history: expenses.map(exp => exp.amount)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
