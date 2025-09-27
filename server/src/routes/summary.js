const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finance',
  password: 'qwezxcasd',
  port: 5432,
});

// @route   GET api/summary
// @desc    Get summary data
// @access  Private (assuming authentication will be added later)
router.get('/', async (req, res) => {
  try {
    // Assuming user_id is available from authentication middleware
    // For now, using a placeholder user_id = 1
    const user_id = 1; 

    // Total Income
    const incomeResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE type = $1 AND user_id = $2',
      ['income', user_id]
    );
    const income = parseFloat(incomeResult.rows[0].total_income);

    // Total Expense
    const expenseResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_expense FROM transactions WHERE type = $1 AND user_id = $2',
      ['expense', user_id]
    );
    const expense = parseFloat(expenseResult.rows[0].total_expense);

    // Expenses by Category
    const expensesByCategoryResult = await pool.query(
      'SELECT category, COALESCE(SUM(amount), 0) AS amount FROM transactions WHERE type = $1 AND user_id = $2 GROUP BY category ORDER BY amount DESC',
      ['expense', user_id]
    );

    // Income vs Expenses (Monthly)
    const incomeVsExpensesResult = await pool.query(
      `SELECT
        TO_CHAR(transaction_date, 'Mon') AS month,
        EXTRACT(MONTH FROM transaction_date) AS month_num,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month, month_num
      ORDER BY month_num ASC`,
      [user_id]
    );

    // Calculate Savings (Income - Expense)
    const savings = income - expense;

    // For investments, we'll use a placeholder for now as there's no dedicated table/category
    const investments = 0; // Placeholder

    res.json({
      income,
      expense,
      savings,
      investments,
      expensesByCategory: expensesByCategoryResult.rows,
      incomeVsExpenses: incomeVsExpensesResult.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
