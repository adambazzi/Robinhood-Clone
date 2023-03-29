import React from "react";
import { useDispatch } from "react-redux";
import { deleteWatchlist } from "../../store/watchlists";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from "../../context/Modal";
import './index.css'

function DeleteWatchlistModel({watchlistId, watchlistName}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(deleteWatchlist(watchlistId));

    closeModal();

  };

  return (
    <>
    <div>
      <h1>Are you sure you want to delete “{watchlistName}”?</h1>
      <button onClick={() => closeModal()}><FontAwesomeIcon icon={faTimes} /></button>
    </div>
      <p>If you delete this list, it'll be gone forever!</p>
      <form onSubmit={handleSubmit} className='delete-form'>
        <button type="submit" className="delete-button">Delete {watchlistName}</button>
      </form>
    </>
  );
}

export default DeleteWatchlistModel;
