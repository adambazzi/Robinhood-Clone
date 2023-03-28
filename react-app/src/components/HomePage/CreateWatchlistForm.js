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
      <form onSubmit={handleSubmit} class="create-watchlist-form">
        <div class="form-input-group">
          <div class="form-input-icon"><FontAwesomeIcon icon={faBolt} /></div>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='List Name' class="form-input"/>
        </div>
        <div class="form-button-group">
          <button onClick={() => setWatchlistFormState(false)} class="cancel-button">Cancel</button>
          <button type="submit" class="create-button">Create List</button>
        </div>
      </form>
    )
}

export default CreateWatchlistForm
