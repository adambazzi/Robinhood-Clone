
import React, { useEffect, useState} from "react";
import { getPortfolioHistories } from "../../store/portfolio_histories";
import { useDispatch, useSelector } from "react-redux";
import { Line } from 'react-chartjs-2';
import './LineGraph.css'

export default function LineGraph ({ portfolio }) {
    // State for storing chart data, range, stock details
    const [chartData, setChartData] = useState({});
    const [range, setRange] = useState(24);
    const [yAxis, setYAxis] = useState([])
    const [labels, setLabels] = useState(null)
    const dispatch = useDispatch();
    const portfolioHistories = useSelector(state => state.portfolioHistories)
    useEffect(() => {
      dispatch(getPortfolioHistories(portfolio.id))
    }, [portfolio])

    useEffect(() => {
      // Convert object to arrays
      const historyArr = Object.values(portfolioHistories)

      // Extract value and date from history array
      const historyValues = historyArr.map(el => el.value);
      const dates = historyArr.map(el => new Date(el.createdAt));
      const rangeDate = new Date();
      rangeDate.setHours(rangeDate.getHours() - range);

      let prevDate = new Date(dates[0]);
      while (prevDate > rangeDate) {
        const newDate = new Date(prevDate);
        newDate.setHours(newDate.getHours() - 1);
        dates.unshift(newDate);
        historyValues.unshift(0);
        prevDate = newDate;
      }


      const filteredValues = historyValues.filter(el => new Date(historyArr.find(e => e.value === el).createdAt) >= rangeDate)
      // Set state with updated data
      setYAxis([...filteredValues])
      setLabels(dates)
    }, [portfolioHistories, range])




    // Fetch stock data from polygon for graph
    useEffect(() => {
      async function fetchChartData() {
        setChartData({
          labels,
          datasets: [{
            data: yAxis,
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
    }, [range, yAxis])

    // Chart.js options
    const options = {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,
            drawOnChartArea: false,
            min: labels ? labels[0] : 0,
            max: labels ? labels[labels.length - 1] : 0
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
        <section className="homePage_chart">
          <div className="homePage-chart__container">
            {/* Display the chart if data has been fetched */}
            {yAxis.length > 0 && (
              <Line
                data={chartData}
                options={options}
              />
            )}
          </div>
          <nav className="homePage-chart-nav">
            {/* Display buttons to change the range of data */}
            <ul>
              <li><button className="chart-nav__button" onClick={() => setRange(1 * 24)}>1D</button></li>
              <li><button className="chart-nav__button" onClick={() => setRange(7 * 24)}>1W</button></li>
              <li><button className="chart-nav__button" onClick={() => setRange(30 * 24)}>1M</button></li>
              <li><button className="chart-nav__button" onClick={() => setRange(90 * 24)}>3M</button></li>
              <li><button className="chart-nav__button" onClick={() => setRange(365 * 24)}>1Y</button></li>
              <li><button className="chart-nav__button" onClick={() => setRange(365*5 * 24)}>5Y</button></li>
            </ul>
          </nav>
        </section>
    );

  }
