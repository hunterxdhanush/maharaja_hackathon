// server/src/services/recommendations.js

const getRecommendations = (summaryData) => {
  const { income, expense, savings } = summaryData;
  const recommendations = [];

  if (expense > income * 0.7) {
    recommendations.push({
      id: 1,
      title: 'Reduce Discretionary Spending',
      description: 'Your expenses are over 70% of your income. Consider cutting back on non-essential spending to improve your financial health.',
      priority: 'high',
    });
  }

  if (savings < income * 0.2) {
    recommendations.push({
      id: 2,
      title: 'Increase Savings',
      description: 'Your savings are less than 20% of your income. Aim to save at least 20% of your income for a secure financial future.',
      priority: 'medium',
    });
  }

  if (savings > income * 0.2) {
    recommendations.push({
      id: 3,
      title: 'Invest in SIP',
      description: 'You are saving more than 20% of your income. Consider investing in a Systematic Investment Plan (SIP) to grow your wealth.',
      priority: 'low',
    });
  }

  return recommendations;
};

module.exports = {
  getRecommendations,
};
