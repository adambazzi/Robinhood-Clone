import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import investments from './investments';
import portfolio from './portfolio';
import transactions from './transactions';
import watchlists from './watchlists';
import transfers from './transfers';
import stocks from './stocks'
import portfolioHistories from './portfolio_histories'

const rootReducer = combineReducers({
  session,
  investments,
  portfolio,
  transactions,
  watchlists,
  transfers,
  stocks,
  portfolioHistories
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
