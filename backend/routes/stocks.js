const express = require('express');
const axios = require('axios');
const { calculateAverage } = require('../utils/calculations');

const router = express.Router();
const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

// Store the token and expiration time
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDMwODM2LCJpYXQiOjE3NDcwMzA1MzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFhODgzZTFmLThlNmItNGEzOS1iNTdmLTEzOTM2YWJiNGNmYSIsInN1YiI6InZpamF5YmhhcmF0aHYuMjJjc2VAa29uZ3UuZWR1In0sImVtYWlsIjoidmlqYXliaGFyYXRodi4yMmNzZUBrb25ndS5lZHUiLCJuYW1lIjoidmlqYXkgYmhhcmF0aCB2Iiwicm9sbE5vIjoiMjJjc3IyMzYiLCJhY2Nlc3NDb2RlIjoiam1wWmFGIiwiY2xpZW50SUQiOiJhYTg4M2UxZi04ZTZiLTRhMzktYjU3Zi0xMzkzNmFiYjRjZmEiLCJjbGllbnRTZWNyZXQiOiJOZFlWdXd4S01ialV5YUFVIn0.ejUchdXJRZAWLBrFGcc46Y3PoWfuXGhAvuowuEHJ8aA'; // Replace with your token
let tokenExpiry = 1747030836; // Replace with the expiry timestamp

// Middleware to refresh the token if expired
const refreshTokenIfNeeded = async () => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  if (currentTime >= tokenExpiry) {
    console.log('Refreshing token...');
    try {
      const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
        email: 'vijaybharathv.22cse@kongu.edu', // Replace with your email
        name: 'vijay bharath v', // Replace with your name
        rollNo: '22csr236', // Replace with your roll number
        accessCode: 'jmpZaF', // Replace with your access code
        clientID: 'aa883e1f-8e6b-4a39-b57f-13936abb4cfa', // Replace with your client ID
        clientSecret: 'NdYVuwxKMbjUyaAU', // Replace with your client secret
      });
      accessToken = response.data.access_token;
      tokenExpiry = response.data.expires_in;
      console.log('Token refreshed successfully.');
    } catch (error) {
      console.error('Failed to refresh token:', error.response?.data || error.message);
    }
  }
};

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes, aggregation } = req.query;

  try {
    // Refresh the token if needed
    await refreshTokenIfNeeded();

    const response = await axios.get(`${BASE_URL}/${ticker}?minutes=${minutes}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const priceHistory = response.data;

    if (aggregation === 'average') {
      const averageStockPrice = calculateAverage(priceHistory);
      res.json({ averageStockPrice, priceHistory });
    } else {
      res.status(400).json({ error: 'Invalid aggregation type' });
    }
  } catch (error) {
    console.error('Error fetching stock data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stock data', details: error.response?.data || error.message });
  }
});
// Route to calculate correlation between two stocks
// Route to calculate correlation between two stocks
router.get('/stockcorrelation', async (req, res) => {
  const { minutes, ticker: tickers } = req.query;

  console.log('Received request for correlation:', { minutes, tickers });

  // Ensure exactly two tickers are provided
  if (!Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: 'Exactly two tickers must be provided' });
  }

  try {
    // Fetch price history for both tickers
    const [stock1, stock2] = await Promise.all(
      tickers.map((ticker) =>
        axios.get(`${BASE_URL}/${ticker}?minutes=${minutes}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
    );

    console.log('Fetched stock data:', { stock1: stock1.data, stock2: stock2.data });

    const stock1Data = stock1.data;
    const stock2Data = stock2.data;

    // Calculate correlation
    const correlation = calculateCorrelation(stock1Data, stock2Data);

    res.json({
      correlation,
      stocks: {
        [tickers[0]]: {
          averagePrice: calculateAverage(stock1Data),
          priceHistory: stock1Data,
        },
        [tickers[1]]: {
          averagePrice: calculateAverage(stock2Data),
          priceHistory: stock2Data,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stock data', details: error.response?.data || error.message });
  }
});

module.exports = router;