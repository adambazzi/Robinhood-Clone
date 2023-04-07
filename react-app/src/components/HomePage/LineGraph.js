import React, { useEffect, useState} from "react";
import { clearPorfolioHistories, getPortfolioHistories } from "../../store/portfolio_histories";
import { useDispatch, useSelector } from "react-redux";
import { Line } from 'react-chartjs-2';
import './LineGraph.css'

export default function LineGraph ({ portfolio }) {
    // State for storing chart data, range, stock details
    const [chartData, setChartData] = useState({});
    const [range, setRange] = useState(90);
    const [yAxis, setYAxis] = useState([])
    const [labels, setLabels] = useState(null)
    const dispatch = useDispatch();
    const portfolioHistories = useSelector(state => state.portfolioHistories)
    useEffect(() => {
      dispatch(getPortfolioHistories(portfolio.id))


    }, [portfolio])

    useEffect(() => {
      dispatch(clearPorfolioHistories())
    }, [])

    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() - range);

    useEffect(() => {
      // Convert object to arrays
      const historyArr = Object.values(portfolioHistories);

      if (historyArr.length === 0) {
        return; // exit the function if the array is empty
      }

      // Extract value and date from history array and sort by date
      const historyValues = historyArr.map(el => {
        return {
          value: el.value,
          date: new Date(el.createdAt)
        };
      }).sort((a, b) => a.date - b.date);

      let prevDate = new Date(historyValues[0].date);
      while (prevDate > rangeDate) {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 1);
        historyValues.unshift({date: newDate, value: 0});
        prevDate = newDate;
      }

      const filteredValues = historyValues.filter(el => el.date > rangeDate);

      // Set state with updated data
      setYAxis([...filteredValues.map(el => el.value)]);
      setLabels([...filteredValues.map(el => el.date)]);
    }, [portfolioHistories, range]);


    // Fetch stock data from polygon for graph
    useEffect(() => {
      async function fetchChartData() {
        setChartData({
          labels,
          maintainAspectRatio: false,
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
          },
          ticks: {
            display: false
          },
        },
        y: {
          // beginAtZero: true,
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
              <li>
                <button
                  className={`chart-nav__button__homepage ${range === 7 ? "active" : ""}`}
                  onClick={() => {
                    setRange(7);
                  }}
                >
                  1W
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button__homepage ${range === 30 ? "active" : ""}`}
                  onClick={() => {
                    setRange(30);
                  }}
                >
                  1M
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button__homepage ${range === 90 ? "active" : ""}`}
                  onClick={() => {
                    setRange(90);
                  }}
                >
                  3M
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button__homepage ${range === 365 ? "active" : ""}`}
                  onClick={() => {
                    setRange(365);
                  }}
                >
                  1Y
                </button>
              </li>
              <li>
                <button
                  className={`chart-nav__button__homepage ${range === 365*5 ? "active" : ""}`}
                  onClick={() => {
                    setRange(365 * 5);
                  }}
                >
                  5Y
                </button>
              </li>

            </ul>
          </nav>
        </section>
    );

  }
