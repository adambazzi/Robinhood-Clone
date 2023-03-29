import React, { useState, useEffect } from "react";
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import { getWatchlists } from "../../store/watchlists";
import { addStocksToWatchlists } from '../../store/watchlists'

function AddToWatchlistModel({ticker}) {
    const dispatch = useDispatch();

    const watchlists = useSelector(state => state.watchlists);
    const watchlistsArr = Object.values(watchlists)

    useEffect(() => {
        dispatch(getWatchlists());
      }, [dispatch]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(true)


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        stockId: ticker,
        watchlistIds: []
    }

    await dispatch(addStocksToWatchlists(payload));

    closeModal();

  };

  return (
  <div>
    <h1>Add TSLA to Your Lists</h1>
    <form onSubmit={handleSubmit} className='edit-list__form'>
        {watchlists.map((watchlist, index) => {
            <div>
                <label for={`option${index}`}>{watchlist.name}</label>
                <input checked={watchlists[watchlist.id] !== undefined} checkedtype="checkbox" name="options" value={`option${index}`} id={`option${index}`} onClick={(e) => setWatchlistIds(watchlistIds.push(e.target.value))}/>
            </div>
        })}

      <button
        type="submit"
        className="edit-list__button"
        disabled={disableButton}
      >
        Save Changes
      </button>
    </form>
  </div>
  );
}

export default AddToWatchlistModel;
