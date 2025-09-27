const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});
app.use(express.json());
app.use('/api/summary', require('./src/routes/summary'));
app.use('/api/transaction', require('./src/routes/transaction'));
app.use('/api/recommendations', require('./src/routes/recommendations'));
app.use('/api/health-score', require('./src/routes/healthScore'));
app.use('/api/predict-expenses', require('./src/routes/predictExpenses'));
app.use('/api/auth', require('./src/routes/auth'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
