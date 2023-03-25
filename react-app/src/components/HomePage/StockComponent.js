import React, { useState, useEffect } from "react";
import { fetchStockData } from "../SingleStockPage/FetchStockData";

function StockComponent({ stock }) {
  const [stockData, setStockData] = useState({});
  const [openCloseDifference, setOpenCloseDifference] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStockData(stock.ticker);
      setStockData(data);
    };
    fetchData();
  }, [stock.ticker]);

  useEffect(() => {
    if (stockData.c && stockData.o) {
      setOpenCloseDifference((stockData.c - stockData.o) / stockData.o);
    }
  }, [stockData]);

  return (
    <div className="stock__component">
      <div>{stock.ticker}</div>
      <div>{stockData.c}</div>
      <div>{openCloseDifference}</div>
    </div>
  );
}

export default StockComponent;
