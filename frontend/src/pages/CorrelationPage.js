import React, { useState, useEffect } from 'react';
import { getCorrelationData } from '../api/api';
import { useNavigate } from 'react-router-dom';
import './CorrelationPage.css';

const CorrelationPage = () => {
  const [correlationData, setCorrelationData] = useState(null);
  const [minutes, setMinutes] = useState(50);
  const [tickers, setTickers] = useState(['NVDA', 'PYPL']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (tickers.length !== 2) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCorrelationData(minutes, tickers);
        setCorrelationData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [minutes, tickers]);

  const handleTickerChange = (value) => {
    const tickerArray = value.split(',').map(t => t.trim().toUpperCase());
    setTickers(tickerArray);
  };

  return (
    <div className="correlation-page">
      <header className="header">
        <h1>Stock Correlation Analysis</h1>
        <button 
          className="stock-button"
          onClick={() => navigate('/')}
        >
          Back to Stock Analysis
        </button>
      </header>

      <div className="controls">
        <div className="input-group">
          <label htmlFor="minutes">Time Interval (minutes):</label>
          <input
            id="minutes"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            min="1"
            max="1440"
          />
        </div>
        <div className="input-group">
          <label htmlFor="tickers">Stock Tickers (comma-separated):</label>
          <input
            id="tickers"
            type="text"
            value={tickers.join(',')}
            onChange={(e) => handleTickerChange(e.target.value)}
            placeholder="NVDA,PYPL"
          />
        </div>
      </div>

      {loading && <div className="loader">Loading correlation data...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {correlationData && !loading && !error && (
        <div className="results">
          <div className="correlation-value">
            <h2>Correlation Coefficient</h2>
            <span className={correlationData.correlation > 0 ? 'positive' : 'negative'}>
              {correlationData.correlation.toFixed(4)}
            </span>
          </div>

          <div className="stocks-grid">
            {Object.entries(correlationData.stocks).map(([ticker, data]) => (
              <div key={ticker} className="stock-card">
                <h3>{ticker}</h3>
                <div className="stock-info">
                  <p>Average Price: ${data.averagePrice.toFixed(2)}</p>
                  <div className="price-history">
                    {data.priceHistory.map((record, index) => (
                      <div key={index} className="price-record">
                        <span>${record.price.toFixed(2)}</span>
                        <span>{new Date(record.lastUpdatedAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationPage;