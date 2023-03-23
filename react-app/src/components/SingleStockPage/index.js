import React from "react";
import LineGraph from "./LineGraph";
import './index.css'


function SingleStockPage(){

	return (
        <>
		<div className="chart__master">
            <LineGraph />
		</div>
        <div className="buySell__master">

        </div>
        </>
	);
}

export default SingleStockPage;
