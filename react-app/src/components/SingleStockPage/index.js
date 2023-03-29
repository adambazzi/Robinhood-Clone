import React, { useState, useEffect } from 'react';
import LineGraph from "./LineGraph";
import './index.css'
import BuySellForm from "./BuySellForm";
import AboutComponent from "./AboutComponent";
import { useParams } from "react-router-dom";
import { fetchStockDetails } from '../../Utils';


function SingleStockPage(){
    const {ticker} = useParams()
    const [details, setDetails] = useState(null);


      // Fetch stock details such as company name
    useEffect(() => {
        async function fetchChartDetails() {
          const incomingDetails = await fetchStockDetails(ticker.toUpperCase());
          setDetails(incomingDetails);
        }
        fetchChartDetails();
      }, [ticker]);

	return (
        <>
		<div className="singleStockPage-upper">
            <LineGraph details={details} />
            <div className="buySell__master">
                <BuySellForm />
            </div>
		</div>
        <div className="singleStockPage-middle">
            <AboutComponent details={details} />
        </div>
        </>
	);
}

export default SingleStockPage;
