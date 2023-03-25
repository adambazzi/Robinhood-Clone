import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWatchlists } from "../../store/watchlists";
// import WatchList from "./WatchlistComponent";

function HomePage(){
    // const dispatch = useDispatch();
    // const watchlists = useSelector(state => state.watchlists)
    // useEffect(() => {
    //         dispatch(getWatchlists());
    // }, []);


    // if (!Object.values(watchlists).length) return null

	return (
        <>
		{/* <section className="homePage__main">
            <div className="homePage_portfolio">

            </div>
            <div className="homePage__sideBar">
                <div className="investingStocks_container">

                </div>
                <div className="watchlists__container">
                    {Object.values(watchlists).map((watchlist) => (
                            <WatchList key={watchlist.id} watchlist={watchlist} />
                    ))}
                </div>
            </div>
		</section> */}
        </>
	);
}

export default HomePage;
