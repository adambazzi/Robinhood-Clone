import React from "react";
import StockComponent from "./StockComponent";

function WatchList({ watchlist }){

        const stocks = watchlist.stocks
	return (

                <div className="watchlist__component">
                        {stocks.map((stock) => (
                                <StockComponent key={stock.id} stock={stock} />
                        ))}
                </div>
	);
}

export default WatchList;
