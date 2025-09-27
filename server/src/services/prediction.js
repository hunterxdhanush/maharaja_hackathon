// server/src/services/prediction.js
const SimpleLinearRegression = require('ml-regression').SimpleLinearRegression;

const predictNextMonthExpense = (historicalData) => {
  // In a real app, historicalData would be fetched from the database.
  // For now, we'll use mock data.
  const mockHistoricalData = [
    { month: 1, expense: 2200 },
    { month: 2, expense: 2400 },
    { month: 3, expense: 2500 },
  ];

  const x = mockHistoricalData.map(d => d.month);
  const y = mockHistoricalData.map(d => d.expense);

  const regression = new SimpleLinearRegression(x, y);

  // Predict for the next month (month 4)
  const prediction = regression.predict(4);

  return Math.round(prediction);
};

module.exports = {
  predictNextMonthExpense,
};
