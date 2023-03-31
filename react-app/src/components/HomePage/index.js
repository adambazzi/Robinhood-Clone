import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchlists } from "../../store/watchlists";
import CreateWatchlistForm from "./CreateWatchlistForm";
import WatchListComponent from "./WatchlistComponent";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css'
import { useWatchlistFormContext } from "../../context/WatchlistContext";
import { fetchStockData } from "../SingleStockPage/FetchStockData";
import StockComponent from "./StockComponent";
import { getInvestments } from "../../store/investments";

function HomePage() {
  const dispatch = useDispatch();
  const { watchlistFormState, setWatchlistFormState } = useWatchlistFormContext();
  const user = useSelector(state => state.session.user);
  const watchlists = useSelector(state => state.watchlists);
  const investments = useSelector(state => state.investments);
  const [investmentStockData, setInvestmentStockData] = useState({});

  useEffect(() => {
    dispatch(getWatchlists());
    dispatch(getInvestments(user.id));
  }, [dispatch, user.id]);

  const fetchStocks = useCallback(async () => {
    const investmentIds = Object.keys(investments);
    const promises = investmentIds.map(id => fetchStockData(investments[id].stock_id));
    const data = await Promise.all(promises);
    const stockDataMap = investmentIds.reduce((acc, id, index) => {
      acc[id] = data[index];
      return acc;
    }, {});
    setInvestmentStockData(stockDataMap);
  }, [investments]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);


  return (
    <section className="homePage__main">
      <div className="homePage_portfolio"></div>
      <div className="homePage__sideBar_container">
        <div className="stocks_container">
          <div className="stocks_container_header">
            <div className="stocks_container_stocks">Stocks</div>
          </div>
          {Object.values(investmentStockData).map((stockData, index) => (
            <StockComponent key={index} stock={stockData} />
          ))}
        </div>
        <div className="watchlists__container">
          <div className="watchlist__main">
            <div className="watchlist__main_lists">Lists</div>
            <button className="watchlist__main_icon" onClick={() => setWatchlistFormState(prevState => !prevState)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          {watchlistFormState && <CreateWatchlistForm />}
          {Object.values(watchlists).length > 0 && Object.values(watchlists).map((watchlist) => (
            <WatchListComponent key={watchlist.id} watchlist={watchlist} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
