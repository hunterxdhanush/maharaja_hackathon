// server/src/models/Transaction.js

/*
  PostgreSQL Transaction Schema:

  CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Foreign key to users table
    type VARCHAR(10) NOT NULL, -- 'income' or 'expense'
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

*/

// This file is a placeholder for a database model.
// In a real application, you would use a library like Sequelize or Knex.js
// to define and interact with your database models.
