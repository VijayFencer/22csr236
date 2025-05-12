// Calculate the average price
function calculateAverage(priceHistory) {
  if (!priceHistory || priceHistory.length === 0) {
    return 0;
  }
  const total = priceHistory.reduce((sum, record) => sum + record.price, 0);
  return total / priceHistory.length;
}

// Calculate Pearson's Correlation Coefficient
function calculateCorrelation(stock1, stock2) {
  const prices1 = stock1.map((record) => record.price);
  const prices2 = stock2.map((record) => record.price);

  const mean1 = prices1.reduce((sum, price) => sum + price, 0) / prices1.length;
  const mean2 = prices2.reduce((sum, price) => sum + price, 0) / prices2.length;

  const covariance = prices1.reduce((sum, price, index) => {
    return sum + (price - mean1) * (prices2[index] - mean2);
  }, 0);

  const stdDev1 = Math.sqrt(
    prices1.reduce((sum, price) => sum + Math.pow(price - mean1, 2), 0)
  );
  const stdDev2 = Math.sqrt(
    prices2.reduce((sum, price) => sum + Math.pow(price - mean2, 2), 0)
  );

  return covariance / (stdDev1 * stdDev2);
}

module.exports = { calculateAverage, calculateCorrelation };