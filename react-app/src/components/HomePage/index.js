import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearWatchlists, getWatchlists } from "../../store/watchlists";
import CreateWatchlistForm from "./CreateWatchlistForm";
import WatchListComponent from "./WatchlistComponent";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css'
import { useWatchlistFormContext } from "../../context/WatchlistContext";
import { fetchStockData, fetchBitcoin, fetchNasdaq, fetchGeneralNews } from "../../Utils";
import StockComponent from "./StockComponent";
import { clearInvestments, getInvestments } from "../../store/investments";
import { clearPortfolios, getPortfolio } from "../../store/portfolio";
import LineGraph from "./LineGraph";
import { clearTransactions, getTransactions } from "../../store/transactions";
import TransactionComponent from "./TransactionComponent";
import { clearStocks } from "../../store/stocks";
import { clearTransfers } from "../../store/transfers";
import NewsFeedComponent from "../SingleStockPage/NewsFeedComponent";

function HomePage() {
  const dispatch = useDispatch();
  const { watchlistFormState, setWatchlistFormState } = useWatchlistFormContext();
  const user = useSelector(state => state.session.user);
  const watchlists = useSelector(state => state.watchlists);
  const investments = useSelector(state => state.investments);
  const portfolio = useSelector(state => state.portfolio)
  const transactions = useSelector(state => state.transactions)
  const [investmentStockData, setInvestmentStockData] = useState({});
  const [bitcoinData, setBitcoinData] = useState(null)
  const [nasdaqData, setNasdaqData] = useState(null)
  const [snacksText, setSnacksText] = useState("");
  const [news, setNews] = useState([])

  useEffect(() => {
      dispatch(clearWatchlists())
      dispatch(clearPortfolios())
      dispatch(clearInvestments())
      dispatch(clearTransactions())
      dispatch(clearStocks())
      dispatch(clearTransfers())
  }, [])

  useEffect(() => {
    const fetchData = async () => {
        // Dispatch Redux actions and wait for them to complete
        await dispatch(getWatchlists());
        await dispatch(getPortfolio(user?.id));

        // Check if portfolio exists and has an ID
        const portfolioId = portfolio?.id;
        if (portfolioId) {
          await dispatch(getInvestments(portfolioId));
          await dispatch(getTransactions(portfolioId));
        }

        // Use Promise.all() to wait for multiple async functions to complete
        const [bitcoin, nasdaq, newsData] = await Promise.all([
          fetchBitcoin(),
          fetchNasdaq(),
          fetchGeneralNews()
        ])

        // Set state
        let bitcoinCloseColor = (Number(bitcoin.c) - Number(bitcoin.o)) / Number(bitcoin.o) < 0 ? 'red' : 'green'
        let nasdaqCloseColor = (Number(nasdaq.low) - Number(nasdaq.preMarket)) / Number(nasdaq.low) < 0 ? 'red' : 'green'
        setBitcoinData({
          percent: Number((((Number(bitcoin.c) - Number(bitcoin.o)) / Number(bitcoin.o)) * 100).toFixed(2)),
          close: Number(bitcoin.c),
          percentColor: bitcoinCloseColor
        });
        setNasdaqData({
          percent: Number((((Number(nasdaq.low) - Number(nasdaq.preMarket)) / Number(nasdaq.low)) * 100).toFixed(2)),
          close: Number(nasdaq.open),
          percentColor: nasdaqCloseColor
        });
        setNews(newsData)


    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStocks = async () => {
      const investmentIds = Object.keys(investments);
      if (investmentIds.length) {
        const promises = investmentIds.map(id => fetchStockData(investments[String(id)].stock_id));
        const data = await Promise.all(promises);
        const stockDataMap = investmentIds.reduce((acc, id, index) => {
          acc[id] = data[index];
          return acc;
        }, {});
        setInvestmentStockData(stockDataMap);
      }
    };

    fetchStocks();
  }, [investments, fetchStockData]);


//Updates the snack text state
useEffect(() => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.

  // Set closing time to 3:00 PM
  const closeTime = new Date();
  closeTime.setHours(15, 0, 0);

  // Set opening time to 8:30 AM
  const openTime = new Date();
  openTime.setHours(8, 30, 0);

  const timeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  if (dayOfWeek >= 1 && dayOfWeek <= 4 && today >= closeTime) { // If it's Monday through Thursday after closing time
    const nextDayOpen = new Date(today);
    nextDayOpen.setDate(today.getDate() + 1); // Set to the next day
    nextDayOpen.setHours(8, 30, 0);
    const formattedNextDayOpen = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(nextDayOpen);
    setSnacksText("Market Opens at " + formattedNextDayOpen);
  } else if (dayOfWeek === 5 && today >= closeTime) { // If it's after closing time on Friday
    const monOpen = new Date(today);
    monOpen.setDate(today.getDate() + 3); // Set date to next Monday
    monOpen.setHours(8, 30, 0);
    const formattedMonOpen = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(monOpen);
    setSnacksText("Mondays open at " + formattedMonOpen);
  } else if (dayOfWeek === 0 || dayOfWeek === 6) { // If it's the weekend
    const monOpen = new Date();
    monOpen.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7); // Find the next Monday
    monOpen.setHours(8, 30, 0);
    const formattedMonOpen = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(monOpen);
    setSnacksText("Mondays open at " + formattedMonOpen);
  } else { // If it's within trading hours
    const formattedCloseTime = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(closeTime);
    setSnacksText("Market Closes at " + formattedCloseTime);
  }
}, []); // The empty array as the second argument to useEffect makes it run only once on mount






  return (
    <section className="homePage__main">
      <div className="homePage_portfolio">
        {Object.values(portfolio).length > 0 && <LineGraph portfolio={portfolio} />}
        {bitcoinData && nasdaqData && <div className="daily-snacks">
          <div className="daily-snacks__top">
            <div className="daily-snacks__nasdaq"><span className='daily-snacks__nasdaq1'>Nasdaq</span> <span className='daily-snacks__nasdaq2'>${nasdaqData.close}</span> <span className={`daily-snacks__nasdaq3 ${nasdaqData.percentColor}`}>{nasdaqData.percent}%</span></div>
            <div className="daily-snacks__bitcoin"><span className='daily-snacks__nasdaq1'>Bitcoin</span> <span className='daily-snacks__nasdaq2'>${bitcoinData.close}</span> <span className={`daily-snacks__nasdaq3 ${nasdaqData.percentColor}`}>{bitcoinData.percent}%</span></div>
          </div>
          <div className="daily-snacks__bottom">
            <div className="daily-snacks__closing-opening">{snacksText}</div>
            <div className="daily-snacks__update">Stocks finished flat as investors digested mixed messages from two Fed officials, who both favored a May rate hike but had different POVs over whether there’d be more hikes.</div>
          </div>
        </div>}
        {news.length > 0 && <div className="home-page__newsFeed">
            {news.map(article => <NewsFeedComponent article={article} key={article.id}/> )}
          </div>}
        <div className="transactions_container">
        {Object.values(transactions)
          .sort((a, b) => new Date(b.executed_at) - new Date(a.executed_at))
          .map(transaction => <TransactionComponent transaction={transaction} key={transaction.id} />)}
        </div>
      </div>
      <div className="homePage__sideBar_container">
        <div className="stocks_container">
          <div className="stocks_container_header">
            <div className="stocks_container_stocks">Stocks</div>
          </div>
          {Object.values(investmentStockData).length > 0 && Object.values(investmentStockData).map((stockData, index) => (
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

