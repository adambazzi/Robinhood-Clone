import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editWatchlist } from "../../store/watchlists";
import { useModal } from "../../context/Modal";
import './EditWatchlistModel.css'

function EditWatchlistModel({watchlistId, watchlist}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(watchlist.name);
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(false)

  useEffect(() => {
    if (name.length < 1 || name.length > 20)  setDisableButton(true)
  }, [name])





  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: name,
      id: watchlistId
    }

    await dispatch(editWatchlist(payload, watchlistId));

    closeModal();

  };

  return (
  <div className='edit-list'>
    <h1 className='edit-list__heading'>Edit List</h1>
    <form onSubmit={handleSubmit} className='edit-list__form'>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='List Name'
        className="edit-list__input"
        maxLength={20}
      />
      <button
        type="submit"
        className="edit-list__button"
        disabled={disableButton}
      >
        Save
      </button>
    </form>
  </div>
  );
}

export default EditWatchlistModel;
