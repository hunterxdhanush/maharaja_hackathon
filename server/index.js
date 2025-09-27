const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});
app.use('/api/summary', require('./src/routes/summary'));
app.use('/api/transaction', require('./src/routes/transaction'));
app.use('/api/recommendations', require('./src/routes/recommendations'));
app.use('/api/health-score', require('./src/routes/healthScore'));
const predictRoutes = require('./src/routes/predict');
app.use('/api/predict', predictRoutes);
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/investments', require('./src/routes/investment'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
