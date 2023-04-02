import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { clearPortfolios, createPortfolio } from "../../store/portfolio";
import './SignupForm.css';
import { clearWatchlists } from "../../store/watchlists";
import { clearInvestments } from "../../store/investments";
import { clearTransactions } from "../../store/transactions";
import { clearStocks } from "../../store/stocks";
import { clearTransfers } from "../../store/transfers";
import { clearPorfolioHistories } from "../../store/portfolio_histories";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  // const [errorsObj, setErrorsObj] = useState({})

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (password === confirmPassword) {
        dispatch(clearWatchlists())
        dispatch(clearPortfolios())
        dispatch(clearInvestments())
        dispatch(clearTransactions())
        dispatch(clearStocks())
        dispatch(clearTransfers())
        dispatch(clearPorfolioHistories())
        const data = await dispatch(signUp(username, firstName, lastName, email, password));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors({...errors, 'confirm': 'Confirm Password field must be the same as the Password field'});
    }
  };

  // if (errors.length) {
  //   const value = errors.reduce((acc, curr) => {
  //     const [key, value] = curr.split(' : ');
  //     acc[key] = value;
  //     return acc;
  //   }, {});
  //   setErrorsObj(value);
  // } else {
  //   setErrorsObj({});
  // }

  // errorsObj.username !== undefined && <div>{errorsObj.username}</div>}

  return (
    <section className="signup__section">
      <div className="signup__imageContainer">
        <img src="https://cdn.robinhood.com/app_assets/odyssey/rockets.png" alt="Sign up image"></img>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h1 className="signup-form_title">Sign Up</h1>
        {/* <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul> */}
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer"><div>Email</div>{errors.email !== undefined && <div className="ErrorText">{errors.email}</div>}</div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer"><div>Username</div>{errors.username !== undefined && <div className="ErrorText">{errors.username}</div>}</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer"><div>First Name</div>{errors.firstName !== undefined && <div className="ErrorText">{errors.firstName}</div>}</div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer"><div>Last Name</div>{errors.lastName !== undefined && <div className="ErrorText">{errors.lastName}</div>}</div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer"><div>Password</div>{errors.password !== undefined && <div className="ErrorText">{errors.password}</div>}{errors.confirm !== undefined && <div className="ErrorText">{errors.confirm}</div>}</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div className="signup-form__label_textContainer">Confirm Password</div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-form__input"
          />
        </label>
        <div className="signup-form__buttons__container">
          <button type="submit" className="signup-form__button">Sign Up</button>
        </div>
      </form>
    </section>
  );
}

export default SignupFormPage;
