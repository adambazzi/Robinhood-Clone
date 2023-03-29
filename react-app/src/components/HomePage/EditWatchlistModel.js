import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editWatchlist } from "../../store/watchlists";
import { useModal } from "../../context/Modal";
import './index.css'

function EditWatchlistModel({watchlistId}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(true)

  useEffect(() => {
    if (name.length < 1)  setDisableButton(false)
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
    <>
      <h1>Edit List</h1>
      <form onSubmit={handleSubmit} className='edit-form'>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='List Name' className="editForm-input"/>
        <button type="submit" className="edit-button" disabled={disableButton}>Save</button>
      </form>
    </>
  );
}

export default EditWatchlistModel;
