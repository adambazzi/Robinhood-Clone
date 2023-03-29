import React, { useState } from "react";
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createWatchlist } from "../../store/watchlists";
import { useDispatch } from "react-redux";
import { useWatchlistFormContext } from "../../context/WatchlistContext";
import './CreateWatchlistForm.css'

function CreateWatchlistForm() {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");
    const [validationErrors, setValidationErrors] = useState({
      invalidInput: ""
    })
    const { watchlistFormState, setWatchlistFormState } = useWatchlistFormContext();


    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            name: inputValue
        }

        const errors = {}
        if (payload.name.length < 1) errors.invalidInput = "Must input a name for watchlist"

        if (!Object.values(errors).length) {
          dispatch(createWatchlist(payload));
          setWatchlistFormState(false)
        } else {
          setValidationErrors(errors)
        }
      };


    return (
      <form onSubmit={handleSubmit} className="create-watchlist-form">
        <div className="form-input-group">
          <div className="form-input-icon"><FontAwesomeIcon icon={faBolt} /></div>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='List Name' className="form-input"/>
        </div>
        <div className="form-button-group">
          <button onClick={() => setWatchlistFormState(false)} className="cancel-button">Cancel</button>
          <button type="submit" className="create-button">Create List</button>
        </div>
      </form>
    )
}

export default CreateWatchlistForm
