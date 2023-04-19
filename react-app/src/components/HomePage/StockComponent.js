import React from "react";
import { NavLink } from "react-router-dom";
import StockComponentGraph from "./StockComponentGraph";
import './StockComponent.css'

function StockComponent({ stock }) {
  const value = ((Number(stock.o) - Number(stock.c))/ Number(stock.o)) * 100


  return (
    <NavLink to={`/stocks/${stock.T}`} className="stock__component">
      <div className="stock__name">{stock.T}</div>
      <div className="stock__graph">
        <StockComponentGraph ticker={stock.T} value={value} />
      </div>
      <div className="stock__values">
        <div>${stock.c}</div>
        <div className={value < 0 ? 'redValue' : 'greenValue'}>{value.toFixed(2)}%</div>
      </div>
    </NavLink>
  );
}

export default StockComponent;
