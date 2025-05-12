const express = require('express');
const axios = require('axios');
const { calculateCorrelation } = require('../utils/calculations');

const router = express.Router();
const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

router.get('/', async (req, res) => {
  const { minutes, ticker: tickers } = req.query;

  if (!Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: 'Exactly two tickers must be provided' });
  }

  try {
    const [stock1, stock2] = await Promise.all(
      tickers.map((ticker) => axios.get(`${BASE_URL}/${ticker}?minutes=${minutes}`))
    );

    const correlation = calculateCorrelation(stock1.data, stock2.data);
    res.json({ correlation, stocks: { [tickers[0]]: stock1.data, [tickers[1]]: stock2.data } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

module.exports = router;