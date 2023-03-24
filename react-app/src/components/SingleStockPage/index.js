import React from "react";
import LineGraph from "./LineGraph";
import './index.css'
import BuySellForm from "./BuySellForm";


function SingleStockPage(){

	return (
        <>
		<div className="chart__master">
            <LineGraph />
            <div className="buySell__master">
                <BuySellForm />
            </div>
		</div>
        </>
	);
}

export default SingleStockPage;
