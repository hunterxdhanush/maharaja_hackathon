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

// @route   POST api/investments
// @desc    Add a new investment
// @access  Private
router.post('/', auth, async (req, res) => {
  const { investment_name, investment_type, amount, purchase_date, current_value, notes } = req.body;

  // Basic validation
  if (!investment_name || !amount || !purchase_date) {
    return res.status(400).json({ msg: 'Please enter all required fields: investment_name, amount, purchase_date' });
  }

  try {
    const user_id = req.user.id; 
    const final_current_value = current_value === '' ? null : current_value;

    const newInvestment = await pool.query(
      'INSERT INTO investments (user_id, investment_name, investment_type, amount, purchase_date, current_value, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
      , [user_id, investment_name, investment_type, amount, purchase_date, final_current_value, notes]
    );
    res.json(newInvestment.rows[0]);
  } catch (err) {
    console.error('Error adding investment:', err.message, err.stack);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
// @route   GET api/investments
// @desc    Get all investments for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id; 

    const investments = await pool.query(
      'SELECT * FROM investments WHERE user_id = $1 ORDER BY purchase_date DESC',
      [user_id]
    );
    res.json(investments.rows);
  } catch (err) {
    console.error('Error fetching investments:', err.message, err.stack);
    res.status(500).send('Server Error');
  }
});
