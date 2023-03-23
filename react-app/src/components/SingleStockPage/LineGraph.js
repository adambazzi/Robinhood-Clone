import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import fetchStockData from './StockData';
import fetchStockDetails from './StockDetails';
import './LineGraph.css';

function LineGraph() {
  // State for storing chart data, range, stock details
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState(90);
  const [details, setDetails] = useState(null);

  // Get the stock ticker from the URL params
  const { ticker } = useParams();

  // Fetch stock details such as company name
  useEffect(() => {
    async function fetchChartDetails() {
      const incomingDetails = await fetchStockDetails(ticker.toUpperCase());
      setDetails(incomingDetails);
    }
    fetchChartDetails();
  }, [ticker]);

  // Fetch stock data from polygon for graph
  useEffect(() => {
    async function fetchChartData() {
      const data = await fetchStockData(ticker.toUpperCase(), range);
      const labels = data.results.map(result => new Date(result.t).toLocaleDateString());
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
        <nav className="chart-nav">
          {/* Display buttons to change the range of data */}
          <ul>
            <li><button className="chart-nav__button" onClick={() => setRange(2)}>1D</button></li>
            <li><button className="chart-nav__button" onClick={() => setRange(8)}>1W</button></li>
            <li><button className="chart-nav__button" onClick={() => setRange(31)}>1M</button></li>
            <li><button className="chart-nav__button" onClick={() => setRange(91)}>3M</button></li>
            <li><button className="chart-nav__button" onClick={() => setRange(366)}>1Y</button></li>
            <li><button className="chart-nav__button" onClick={() => setRange(365*5)}>5Y</button></li>
          </ul>
        </nav>
      </div>
    </section>
  );

}
  export default LineGraph
