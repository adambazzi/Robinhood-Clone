import React, { useState, useEffect } from "react";
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
    const { setWatchlistFormState } = useWatchlistFormContext();



    const handleSubmit = (event) => {
      event.preventDefault();

      const payload = {
        name: inputValue
      }

      const errors = {}
      if (payload.name.length < 1) errors.invalidInput = "Must input a name for watchlist"
      if (payload.name.length > 20) errors.invalidInput = "Your list name must be less than 20 characters."

      if (!Object.values(errors).length) {
        dispatch(createWatchlist(payload));
        setWatchlistFormState(false)
      } else {
        setValidationErrors(errors)
      }
    };



    useEffect(() => {
      if (validationErrors.invalidInput.length && inputValue.length <= 20) {
        setValidationErrors({ invalidInput: "" });
      }
    }, [inputValue, validationErrors]);

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
        {validationErrors.invalidInput.length > 0 && <div className="create-watchlist__error-menu"><div id="create-watchlist__error-menu1">ⓘ</div><div id="create-watchlist__error-menu2">{validationErrors.invalidInput}</div></div> }
      </form>
    )
}

export default CreateWatchlistForm
