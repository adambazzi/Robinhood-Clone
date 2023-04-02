import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { fetchStockChartData } from '../../Utils';
import './LineGraph.css';

function LineGraph({details}) {
  // State for storing chart data, range, stock details
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState(90);


  // Get the stock ticker from the URL params
  const { ticker } = useParams();

  // Fetch stock details such as company name


  // Fetch stock data from polygon for graph
  useEffect(() => {
    async function fetchChartData() {
      const data = await fetchStockChartData(ticker.toUpperCase(), range);
      const labels = data.results.map(result => new Date(result.t).toLocaleString());
      const prices = data.results.map(result => result.c);
      setChartData({
        labels,
        datasets: [{
          data: prices,
          backgroundColor: 'none',
          borderColor: '#5AC53B',
          borderWidth: 2,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#5AC53B',
          pointHoverBorderColor: '#000000',
          pointHoverBorderWidth: 4,
          pointHoverRadius: 6,
          tension: 0.0,
          fill: false
        }],
      });
    }
    fetchChartData();
  }, [range, ticker]);

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawOnChartArea: false
        },
        ticks: {
          display: false
        },
      },
      y: {
        grid: {
          display: false,
          drawOnChartArea: false
        },
        ticks: {
          display: false
        },
      }
    },
    plugins: {
      legend: false,
    },
  };



  return (
      <section className="stock__chart">
        {/* Display the company name if it has been fetched */}
        <h3>{details && details.name}</h3>
        <div className="chart__container">
          {/* Display the chart if data has been fetched */}
          {chartData && (
            <Line
              data={chartData}
              options={options}
            />
          )}
        </div>
        <nav className="chart-nav">
          {/* Display buttons to change the range of data */}
          <ul>
              <li>
                <button
                  className={`chart-nav__button ${range === 7 ? "active" : ""}`}
                  onClick={() => {
                    setRange(7);
                  }}
                >
                  1W
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button ${range === 30 ? "active" : ""}`}
                  onClick={() => {
                    setRange(30);
                  }}
                >
                  1M
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button ${range === 90 ? "active" : ""}`}
                  onClick={() => {
                    setRange(90);
                  }}
                >
                  1Y
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button ${range === 365 ? "active" : ""}`}
                  onClick={() => {
                    setRange(365);
                  }}
                >
                  5Y
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button ${range === 1825 ? "active" : ""}`}
                  onClick={() => {
                    setRange(1825);
                  }}
                >
                  10Y
                </button>
              </li>

            </ul>
        </nav>
      </section>
  );

}
  export default LineGraph
