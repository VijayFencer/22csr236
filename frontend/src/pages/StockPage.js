import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getStockData } from '../api/api';
import { useNavigate } from 'react-router-dom';
import './StockPage.css'; // Add this import

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockPage = () => {
  const [data, setData] = useState(null);
  const [ticker, setTicker] = useState('NVDA');
  const [minutes, setMinutes] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const stockData = await getStockData(ticker, minutes);
        setData(stockData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching stock data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticker, minutes]);

  const chartData = data ? {
    labels: data.priceHistory.map((record) =>
      new Date(record.lastUpdatedAt).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Stock Price',
        data: data.priceHistory.map((record) => record.price),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Price',
        data: Array(data.priceHistory.length).fill(data.averageStockPrice),
        borderColor: '#FF5722',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: false,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: `${ticker} Stock Price History`,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className="stock-page">
      <header className="header">
        <h1>Stock Price Analysis</h1>
        <button 
          className="correlation-button"
          onClick={() => navigate('/correlation')}
        >
          View Correlation Analysis
        </button>
      </header>

      <div className="controls">
        <div className="input-group">
          <label htmlFor="ticker">Ticker Symbol:</label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol"
          />
        </div>
        <div className="input-group">
          <label htmlFor="minutes">Time Interval (minutes):</label>
          <input
            id="minutes"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            min="1"
            max="1440"
          />
        </div>
      </div>

      <div className="chart-container">
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        {data && !loading && !error && (
          <>
            <div className="stats">
              <div className="stat-item">
                <span>Average Price:</span>
                <span className="value">${data.averageStockPrice.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span>Latest Price:</span>
                <span className="value">
                  ${data.priceHistory[data.priceHistory.length - 1].price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="chart">
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockPage;