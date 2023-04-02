import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage"
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SingleStockPage from "./components/SingleStockPage";
import HomePage from "./components/HomePage";
import TransfersPage from "./components/TransfersPage";
import './index.css'


function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.session.user);
  const isAuthenticated = Boolean(user);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(authenticate())
      // .then(() => setIsLoaded(true))
      .then(() => setIsAuthCheckComplete(true))
      .catch(() => setIsAuthCheckComplete(true));
  }, [dispatch]);

  // Hide Navigation component on /login page
  const showNavigation = location.pathname !== '/login' && user;

  if (!isAuthCheckComplete) {
    // You can render a spinner or a loading message here if needed
    return <div>Loading...</div>;
  }

  return (
    <>
      {showNavigation && <Navigation />}
      <Switch>
        <Route exact path="/login">
          {isAuthenticated ? (
            <Redirect to="/" />
          ) : (
            <LoginFormPage />
          )}
        </Route>
        <Route exact path="/signup">
          <SignupFormPage />
        </Route>
        <Route exact path="/stocks/:ticker">
          {isAuthenticated ? (
            <SingleStockPage />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/">
          {isAuthenticated ? (
            <HomePage />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/transfers">
          {isAuthenticated ? (
            <TransfersPage />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        {/* Redirect unauthenticated users to login page */}
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </>
  );
}

export default App;
