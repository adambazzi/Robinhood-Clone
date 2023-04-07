import React, { useState, useEffect } from 'react';
import LineGraph from "./LineGraph";
import './index.css'
import BuySellForm from "./BuySellForm";
import AboutComponent from "./AboutComponent";
import { useParams } from "react-router-dom";
import { fetchStockDetails } from '../../Utils';
import { fetchTickerNews } from '../../Utils';
import NewsFeedComponent from './NewsFeedComponent';


function SingleStockPage(){
    const {ticker} = useParams()
    const [details, setDetails] = useState(null);
    const [news, setNews] = useState([])



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
        const data = await fetchTickerNews(ticker.toUpperCase());
        data.sort((a, b) => {
          const dateA = new Date(a.published_utc);
          const dateB = new Date(b.published_utc);
          return dateB - dateA;
        });
        await setNews(data);
      }
      fetchChartData();
    }, [ticker]);

    if (!news.length) return null

	return (
        <>
        <div className="singleStockPage-upper">
            <LineGraph details={details} ticker={ticker} />
            <div className="buySell__master">
                <BuySellForm />
            </div>
        </div>
        <div className="singleStockPage-middle">
            <AboutComponent details={details} />
            <div className='news__section'>
              <h2 className='news_header'>News</h2>
              {news.map(article => <NewsFeedComponent article={article} key={article.id}/>) }
            </div>
        </div>
        </>
	);
}

export default SingleStockPage;
