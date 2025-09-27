const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const auth = require('../middleware/auth');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finance',
  password: 'qwezxcasd',
  port: 5432,
});

// @route   POST api/transaction
// @desc    Create a new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  const { type, category, amount, date, notes } = req.body;

  // Basic validation
  if (!type || !category || !amount || !date) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    const user_id = req.user.id; 

    const query = 'INSERT INTO transactions (user_id, type, category, amount, transaction_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [user_id, type, category, amount, date, notes];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding transaction:', err.message, err.stack);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transaction
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const user_id = req.user.id; 

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const queryParams = [user_id];

    if (type) {
      query += ' AND type = $2';
      queryParams.push(type);
    }

    query += ' ORDER BY transaction_date DESC';

    const transactions = await pool.query(query, queryParams);
    res.json(transactions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
