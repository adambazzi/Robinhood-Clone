import React from "react";
import { NavLink } from "react-router-dom";
import StockComponentGraph from "./StockComponentGraph";
import './StockComponent.css'

function StockComponent({ stock }) {
  const value = ((Number(stock[0].o) - Number(stock[0].c))/ Number(stock[0].o)) * 100


  return (
    <NavLink to={`/stocks/${stock[0].T}`} className="stock__component">
      <div className="stock__name">{stock[0].T}</div>
      <div className="stock__graph">
        <StockComponentGraph ticker={stock[0].T} value={value} />
      </div>
      <div className="stock__values">
        <div>${stock[0].c}</div>
        <div className={value < 0 ? 'redValue' : 'greenValue'}>{value.toFixed(2)}%</div>
      </div>
    </NavLink>
  );
}

export default StockComponent;
