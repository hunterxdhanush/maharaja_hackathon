const { Matrix } = require("ml-matrix");
const LinearRegression = require("ml-regression-multivariate-linear");

/**
 * Train and predict expenses based on user history
 * @param {Array<number>} expenses - User's past monthly expenses
 * @returns {number} predicted expense for next month
 */
function predictExpense(expenses) {
  if (expenses.length < 2) {
    return expenses[0] || 0; // Return last expense or 0 if no data
  }

  // Calculate features
  const features = expenses.map((expense, index) => {
    const month = index + 1;
    const trend = month; // Linear trend
    const prevExpense = index > 0 ? expenses[index - 1] : expense;
    const expenseChange = expense - prevExpense;
    
    return [
      month, // Time trend
      expense, // Current expense
      expenseChange, // Rate of change
      Math.sin(2 * Math.PI * month / 12), // Seasonal component (sine)
      Math.cos(2 * Math.PI * month / 12), // Seasonal component (cosine)
    ];
  });

  const X = new Matrix(features);
  const Y = new Matrix(expenses.map(expense => [expense]));

  try {
    // Train model
    const regression = new LinearRegression(X, Y);

    // Prepare features for next month prediction
    const nextMonth = expenses.length + 1;
    const lastExpense = expenses[expenses.length - 1];
    const lastChange = lastExpense - expenses[expenses.length - 2];

    const nextMonthFeatures = [
      nextMonth,
      lastExpense,
      lastChange,
      Math.sin(2 * Math.PI * nextMonth / 12),
      Math.cos(2 * Math.PI * nextMonth / 12)
    ];

    // Make prediction
    const prediction = regression.predict([nextMonthFeatures]);
    
    // Apply constraints
    const minPrediction = Math.min(...expenses) * 0.7; // Not less than 70% of minimum
    const maxPrediction = Math.max(...expenses) * 1.3; // Not more than 130% of maximum
    
    // Constrain prediction within reasonable bounds
    const constrainedPrediction = Math.min(
      Math.max(prediction[0][0], minPrediction),
      maxPrediction
    );

    // Calculate confidence factor based on data consistency
    const mean = expenses.reduce((a, b) => a + b, 0) / expenses.length;
    const variance = expenses.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / expenses.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = stdDev / mean;

    // Adjust prediction based on consistency
    if (coefficient > 0.5) { // High variability
      // Move prediction closer to recent average
      const recentAvg = expenses.slice(-3).reduce((a, b) => a + b, 0) / 3;
      return (constrainedPrediction * 0.7 + recentAvg * 0.3);
    }

    return constrainedPrediction;

  } catch (error) {
    console.error('Prediction error:', error);
    // Fallback to moving average if regression fails
    const recentExpenses = expenses.slice(-3);
    return recentExpenses.reduce((a, b) => a + b, 0) / recentExpenses.length;
  }
}

module.exports = { predictExpense };
