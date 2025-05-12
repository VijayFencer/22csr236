import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getStockData = async (ticker, minutes) => {
  const response = await axios.get(
    `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}&aggregation=average`
  );
  return response.data;
};
export const getCorrelationData = async (minutes, tickers) => {
  if (!Array.isArray(tickers) || tickers.length !== 2) {
    throw new Error('Exactly two tickers must be provided');
  }

  const response = await axios.get(
    `${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${tickers.join('&ticker=')}`
  );
  
  if (!response.data) {
    throw new Error('No data received from server');
  }

  return response.data;
};