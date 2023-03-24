import React from "react";
import LineGraph from "./LineGraph";
import './index.css'
import BuySellForm from "./BuySellForm";


function SingleStockPage(){

	return (
        <>
		<div className="chart__master">
            <LineGraph />
		</div>
        <div className="buySell__master">
            <BuySellForm />
        </div>
        </>
	);
}

export default SingleStockPage;
