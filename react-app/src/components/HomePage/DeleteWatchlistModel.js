import React from "react";
import { useDispatch } from "react-redux";
import { deleteWatchlist } from "../../store/watchlists";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from "../../context/Modal";
import './DeleteWatchlistModel.css'

function DeleteWatchlistModel({watchlistId, watchlistName}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(deleteWatchlist(watchlistId));

    closeModal();

  };

  return (
  <div className='delete-modal'>
    <div className='delete-modal__header'>
      <h1 className='delete-modal__heading'>Are you sure you want to delete “{watchlistName}”?</h1>
      <button className='delete-modal__close-button' onClick={() => closeModal()}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
    <p className='delete-modal__message'>If you delete this list, it'll be gone forever!</p>
    <form onSubmit={handleSubmit} className='delete-modal__form'>
      <button type="submit" className="delete-modal__button">Delete {watchlistName}</button>
    </form>
  </div>
  );
}

export default DeleteWatchlistModel;
