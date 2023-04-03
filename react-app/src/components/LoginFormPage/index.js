import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import './LoginForm.css';
import { clearTransactions } from "../../store/transactions";
import { clearWatchlists } from "../../store/watchlists";
import { clearPortfolios } from "../../store/portfolio";
import { clearInvestments } from "../../store/investments";
import { clearStocks } from "../../store/stocks";
import { clearTransfers } from "../../store/transfers";
import { clearPorfolioHistories } from "../../store/portfolio_histories";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory()

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearWatchlists())
    dispatch(clearPortfolios())
    dispatch(clearInvestments())
    dispatch(clearTransactions())
    dispatch(clearStocks())
    dispatch(clearTransfers())
    dispatch(clearPorfolioHistories())
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push('/')

    }
  };

  const loginDemoUser = async (e) => {
    e.preventDefault();
    dispatch(clearWatchlists())
    dispatch(clearPortfolios())
    dispatch(clearInvestments())
    dispatch(clearTransactions())
    dispatch(clearStocks())
    dispatch(clearTransfers())
    dispatch(clearPorfolioHistories())
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data) {
      setErrors(data);
    } else {
      history.push('/')

    }
  };

  return (
    <section className="login__section">
      <div className="login__imageContainer">
        <img src="https://cdn.robinhood.com/assets/generated_assets/webapp/web-platform-prefetch-sdp/member/632fcb3e7ed928b2a960f3e003d10b44.jpg" alt="Login Image" />
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-form__title">Log in to Arrow</h1>

        <div className="login-form__errors">{Object.values(errors).length > 0 ? 'Unable to login with provided credentials' : ''}</div>
        <label className="login-form__label">
          <div>Email</div>
          <input
            className="login-form__input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="login-form__label">
          <div>Password</div>
          <input
            className="login-form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="login-form__buttons__container">
          <button className="login-form__button" type="submit">Log In</button>
          <div className="login-form__button_or_container">
            <hr className="login-form__button_or_line"/><div>   or   </div><hr className="login-form__button_or_line"/>
          </div>
          <button className="login-form__button__demoUser" onClick={loginDemoUser}>Log in as demo user</button>
          <div className="create-account__button-container">Not on Arrow? <NavLink to='/signup'>Create an account</NavLink></div>
        </div>
      </form>

    </section>
  );
}

export default LoginFormPage;
