import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getWatchlists } from "../../store/watchlists";
import { createWatchlistStocks, deleteWatchlistStocks } from "../../store/watchlist_stocks";
import { clearWatchlists } from "../../store/watchlists";
import './ReviseWatchlistModal.css'

function ReviseWatchlistModal({ stockId }) {
  const dispatch = useDispatch();

  // State variables
  const [watchlistIds, setWatchlistIds] = useState([]);

  // Other variables
  const { closeModal } = useModal();
  const watchlists = useSelector((state) => state.watchlists);
  const watchlistsArr = Object.values(watchlists);

  // Effect hooks
  useEffect(() => {
    dispatch(getWatchlists());
  }, [dispatch]);

  useEffect(() => {
    const initialWatchlistIds = Object.values(watchlists)
      .filter((watchlist) => {
        return watchlist.stocks.some((stock) => stock.id === stockId);
      })
      .map((watchlist) => watchlist.id);
    setWatchlistIds(initialWatchlistIds);
  }, [watchlists, stockId]);

  // Event handlers
  const handleWatchlistChange = (e) => {
    const watchlistId = parseInt(e.target.id.split("-")[1], 10);
    const isChecked = e.target.checked;

    setWatchlistIds((prevIds) => {
      if (isChecked) {
        return [...prevIds, watchlistId];
      } else {
        return prevIds.filter((id) => id !== watchlistId);
      }
    });
  };





  const handleSubmit = async (e) => {
    e.preventDefault();


    const addTo = watchlistIds.filter((id) => !watchlists[id].stocks.find(stock => stock.id === stockId));
    const remove = watchlistsArr.filter((watchlist) => {
      const stockIds = watchlist.stocks.map((stock) => stock.id);
      return stockIds.includes(stockId) && !watchlistIds.includes(watchlist.id);
    }).map((watchlist) => watchlist.id);
    const payload = { stockId, addTo, remove };

    if (addTo.length) {
      await dispatch(createWatchlistStocks(payload));
    }
    if (remove.length) {
      await dispatch(deleteWatchlistStocks(payload));
    }

    dispatch(clearWatchlists())
    closeModal();
  };

  // JSX elements
  return (
    <div className="watchlist-stocks">
      <h1 className="watchlist-stocks__heading">Add TSLA to Your Lists</h1>
      <form onSubmit={handleSubmit} className="watchlist-stocks__form">
        {watchlistsArr.map((watchlist) => (
          <div key={watchlist.id} className='watchlist-stocks__component'>
            <input
              type="checkbox"
              id={`watchlist-${watchlist.id}`}
              checked={watchlistIds.includes(watchlist.id)}
              onChange={handleWatchlistChange}
              className='watchlist-stocks__input'
            />
            <label htmlFor={`watchlist-stocks-${watchlist.id}`}>{watchlist.name}</label>
          </div>
        ))}

        <button type="submit" className="watchlist-stocks__button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ReviseWatchlistModal;
