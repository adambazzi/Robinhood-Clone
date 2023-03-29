import React from "react";
import { NavLink } from "react-router-dom";
import './SearchBarComponent.css'
import { useStockContext } from '../../context/StockContext';

function SearchBarComponent (stock) {
    const { setStockSearchQuery } = useStockContext();
    const stockName = stock.stock.orgName


    return (
        <NavLink className="searchBar__component-container" to={`/stocks/${stock.stock.id}`} onClick={() => setStockSearchQuery('')}>
            <div className="searchBar__component-name">{stockName}</div>
        </NavLink>
    )
}

export default SearchBarComponent
