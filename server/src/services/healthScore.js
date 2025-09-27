// server/src/services/healthScore.js

const calculateHealthScore = (summaryData) => {
  const { income, expense, savings } = summaryData;

  if (income === 0) {
    return 0; // Avoid division by zero
  }

  const savings_ratio = savings / income;
  const expense_ratio = expense / income;

  // Mock consistency (in a real app, this would be calculated based on historical data)
  const consistency = Math.random() * 0.5 + 0.5; // Random value between 0.5 and 1.0

  const score = savings_ratio * 40 + (1 - expense_ratio) * 30 + consistency * 30;

  // Ensure the score is between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  return Math.round(normalizedScore);
};

module.exports = {
  calculateHealthScore,
};
