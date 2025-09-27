const express = require('express');
const router = express.Router();

// @route   POST api/transaction
// @desc    Create a new transaction
// @access  Public
router.post('/', (req, res) => {
  const { type, category, amount, date, notes } = req.body;

  // Basic validation
  if (!type || !category || !amount || !date) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  const { Pool } = require('pg');
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'finance',
    password: 'qwezxcasd',
    port: 5432,
  });

  const query = 'INSERT INTO transactions (user_id, type, category, amount, transaction_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [1, type, category, amount, date, notes]; // Assuming user_id 1 for now

  pool.query(query, values)
    .then(result => res.json(result.rows[0]))
    .catch(err => {
      console.error('Error adding transaction:', err.message, err.stack);
      res.status(500).send('Server Error');
    });
});

// @route   GET api/transaction
// @desc    Get all transactions for a user
// @access  Private (assuming authentication will be added later)
router.get('/', async (req, res) => {
  try {
    // Assuming user_id is available from authentication middleware
    // For now, using a placeholder user_id = 1
    const user_id = 1; 

    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC',
      [user_id]
    );
    res.json(transactions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
