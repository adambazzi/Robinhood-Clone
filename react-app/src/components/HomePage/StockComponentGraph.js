import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchStockChartData } from '../../Utils';
import './StockComponentGraph.css'

function StockComponentGraph({ ticker, value }) {
  // State for storing chart data, range, stock details
  const [chartData, setChartData] = useState(null);
  const range = 90;


  // Fetch stock data from polygon for graph
  useEffect(() => {
    let isMounted = true;

    async function fetchChartData() {
      const data = await fetchStockChartData(ticker.toUpperCase(), range);
      const labels = data.results.map(result => new Date(result.t).toLocaleDateString());
      const prices = data.results.map(result => result.c);
      if (isMounted) {
        setChartData({
          labels,
          datasets: [{
            data: prices,
            backgroundColor: 'none',
            borderColor: value < 0 ? 'red' : '#5AC53B',
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
    }

    fetchChartData();

    return () => {
      isMounted = false;
      setChartData(null);
    };
  }, [ticker, value, range]);

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
      <>
        {/* Display the chart if data has been fetched */}
        {chartData && (
          <Line
            data={chartData}
            options={options}
            className="stock__component__chart"
          />
        )}
      </>
  );

}
  export default StockComponentGraph
