import React, { useEffect, useState, useRef } from "react";
import StockComponent from "./StockComponent";
import { fetchStockData } from "../../Utils";
import EditWatchlistModel from "./EditWatchlistModel";
import DeleteWatchlistModel from "./DeleteWatchlistModel";
import OpenModalButton from "../OpenModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import "./WatchlistComponent.css";

function WatchListComponent({ watchlist }) {
  // State variables for showing and hiding stock data and fliping the icon
  const [stockData, setStockData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // State variables for showing and hiding the modal menu

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // Function for opening the other options menu
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // Close the modal menu when user clicks outside of it
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // Fetch the stock data from API
  useEffect(() => {
    const fetchStocks = async () => {
      const promises = watchlist.stocks.map((stock) => fetchStockData(stock.id));
      const data = await Promise.all(promises);
      setStockData(data);
    };
    fetchStocks();
  }, [watchlist.stocks]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  // Define the class name of the dropdown menu based on the state variable
  const ulClassName = "watchlist-dropdown" + (showMenu ? "" : " hidden");

  // Function to toggle the visibility of the stock data and flip the icon
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsFlipped(!isFlipped);
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <div className="watchlist__component">
      <div className="watchlist__header">

        <div className="watchlist__name"><div className="watchlist__header_icon"><FontAwesomeIcon icon={faBolt} /></div><div>{watchlist.name}</div></div>
        <div className="watchlist__options">
          {/* The icon for showing the dropdown menu */}
          <div className="watchlist__options__otherOptions" onClick={openMenu}>
            <FontAwesomeIcon icon={faEllipsis} />
          </div>
          {/* The dropdown menu */}
          <ul className={ulClassName} ref={ulRef}>
            <li>
              <OpenModalButton
                buttonText="Edit"
                onItemClick={closeMenu}
                modalComponent={<EditWatchlistModel watchlistId={watchlist.id} watchlist={watchlist} />}
                />
            </li>
            <li>
              <OpenModalButton
                buttonText="Delete"
                onItemClick={closeMenu}
                modalComponent={<DeleteWatchlistModel watchlistId={watchlist.id} watchlistName={watchlist.name} />}
                />
            </li>
          </ul>
          {/* The icon for showing and hiding the stock data */}
          <div
            className={`watchlist__icon${isFlipped ? " flipped" : ""}`}
            onClick={toggleVisibility}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      {/* Show the stock data if isVisible is true */}
      {isVisible && stockData.length > 0 && stockData.map((stock, index) => (
        <StockComponent key={index} stock={stock} />
      ))}
    </div>
  );
}

export default WatchListComponent;
