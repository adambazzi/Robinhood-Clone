import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { createPortfolio } from "../../store/portfolio";
import './SignupForm.css';

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

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, firstName, lastName, email, password));
        await dispatch(createPortfolio(Number(data.id)))
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <section className="signup__section">
      <div className="signup__imageContainer">
        <img src="https://cdn.robinhood.com/app_assets/odyssey/rockets.png" alt="Sign up image"></img>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h1 className="signup-form_title">Sign Up</h1>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label className="signup-form__label">
          <div>Email</div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div>Username</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div>First Name</div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div>Last Name</div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-form__input"
          />
        </label>
        <label className="signup-form__label">
          <div>Confirm Password</div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
