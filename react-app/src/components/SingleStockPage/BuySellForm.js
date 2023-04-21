
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createInvestment, editInvestment, getInvestments } from '../../store/investments';
import { getPortfolio, editPortfolio } from '../../store/portfolio';
import { createTransaction } from '../../store/transactions';
import { fetchClosingCost } from '../../Utils';
import { deleteInvestment } from '../../store/investments';
import ReviseWatchlistModal from './ReviseWatchlistModal';
import OpenModalButton from "../OpenModalButton";
import './BuySellForm.css';

const BuySellForm = () => {
  const dispatch = useDispatch();

  // State variables
  const [buyingOption, setBuyingOption] = useState(true); // true: buy, false: sell
  const [buy, setBuy] = useState(true); // true: buy, false: sell
  const [amount, setAmount] = useState(0); // the dollar amount to buy/sell
  const [stockData, setStockData] = useState(0); // the current stock price
  const [foundInvestment, setFoundInvestment] = useState({}); // object with the user's investment details (if any)
  const { ticker } = useParams(); // the stock symbol passed as a parameter
  const [validationErrors, setValidationErrors] = useState({
    buyPowerInsufficient: '',
    unableToSell: '',
    inputCannotBeNegative: '',
  });

  // Redux state variables
  const user = useSelector(state => state.session.user); // the logged in user
  const investments = useSelector(state => state.investments); // the user's investments
  const portfolio = useSelector(state => state.portfolio); // the user's portfolio

  // Fetch portfolio data when the user logs in or logs out
  useEffect(() => {
    dispatch(getPortfolio(Number(user.id)));
  }, [dispatch, user]);

  // Fetch investment and stock data when the component mounts or when the stock ticker changes
  useEffect(() => {
    const fetchInvestmentData = async () => {
      if (portfolio.id) {
        dispatch(getInvestments(Number(portfolio.id)));
      }
    };
    const fetchStockData = async () => {
      const value = await fetchClosingCost(ticker);
      setStockData(Number(value));
    };

    Promise.all([fetchInvestmentData(), fetchStockData()])
      .catch((error) => console.error(error));
  }, [dispatch, portfolio.id, ticker]);

  // Update the foundInvestment state variable when the user's investments or the stock ticker changes
  useEffect(() => {
    setFoundInvestment(Object.values(investments).find(investment => investment.stock_id === ticker) || {});
  }, [investments, ticker]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate transaction data
    const numAmount = Number(amount);
    const numShares = buyingOption ? numAmount / stockData : numAmount;
    const totalExpense = buy ? stockData * numShares : -1 * stockData * numShares;
    const averagePrice = stockData;

    // Create payload object with data to be sent to the server
    const payload = {
      transaction: {
        portfolioId: portfolio.id,
        stockId: ticker,
        numShares,
        averagePrice,
        totalExpense,
      },
      investment: {
        portfolioId: portfolio.id,
        stockId: ticker,
        numShares: buy
          ? (Object.values(foundInvestment).length ? Number(foundInvestment.num_shares) + numShares : numShares)
          : (Object.values(foundInvestment).length ? Number(foundInvestment.num_shares) - numShares : numShares),
      },
      portfolio: {
        userId: user.id,
        buyingPower: portfolio.buying_power - totalExpense,
      },
    };

    // Validate form data and handle errors
    const errors = {};
    if (buy && payload.transaction.totalExpense > portfolio.buying_power) {
      errors.buyPowerInsufficient = 'Buy power insufficient';
    }
    if (buy && Number(payload.transaction.totalExpense.toFixed(2)) <= 0) {
      errors.inputCannotBeNegative = 'Input cannot be negative or 0';
    }

    if (buy === false && payload.transaction.totalExpense >= 0) {
        errors.inputCannotBeNegative = "Input cannot be negative or 0";
    }
    if (payload.investment.numShares < 0) {
        errors.unableToSell = "Unable to sell, insufficient funds";
    }
    if (typeof payload.investment.numShares === 'NaN') {
      errors.unableToSell = "Invalid input";
  }

  // If there are no validation errors, dispatch the necessary actions to update the investment, portfolio, and transaction data
  if (!Object.values(errors).length) {
    // Check if the investment exists in the Redux store
    const investmentExists = Object.values(foundInvestment).length;
    let createdTransactionId;

    const verifyInvestmentDelete = Number((Number(payload.investment.numShares) * Number(payload.transaction.averagePrice)).toFixed(2))
    // Create or edit the investment data
    if (investmentExists && verifyInvestmentDelete > 0) {
      dispatch(editInvestment(payload.investment, Number(foundInvestment.id)));
    }
    else if (investmentExists && verifyInvestmentDelete === 0) {
      setBuy(true)
      dispatch(deleteInvestment(Number(foundInvestment.id)))
    } else {
      dispatch(createInvestment(payload.investment));
    }

    // Edit the portfolio data
    dispatch(editPortfolio(payload.portfolio, Number(portfolio.id)));

    // Create the transaction data
    let newTransaction = dispatch(createTransaction(payload.transaction));

    createdTransactionId = Number(newTransaction.id);
  } else {
    // If there are validation errors, set the validationErrors state to the error messages
    setValidationErrors(errors);
  }
};


  // State variables for showing and hiding the modal menu

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // Close the modal menu when user clicks outside of it
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  const closeMenu = () => setShowMenu(false);

  if (!Object.values(portfolio).length) return null

  return (
      <section className='stock-form-section'>
        <div className='stock-form-container'>
          <form className='stock__buyForm' onSubmit={handleSubmit}>
            <div className='buy-sell-buttons-container'>
              <div className='buy-sell-buttons'>
                <button type="button" className={`buy-button ${buy ? 'underline' : ''}`} onClick={() => setBuy(true)}>Buy</button>
                {foundInvestment && Object.values(foundInvestment).length > 0 && <button type="button" className={`sell-button ${buy ? '' : 'underline'}`} onClick={() => setBuy(false)}>Sell</button>}
              </div>
            </div>
            <div className='buySell__entryContainer'>
              <div>Order Type</div>
              <div>Market Order ⓘ</div>
            </div>
            <div className='buySell__entryContainer'>
              <label className='buy-option-label'>{buy ? 'Buy in' : 'Sell in'}</label>
              <select id="buyForm__dropdown_buyingOption" className='buying-option' value={buyingOption} onChange={(e) => setBuyingOption(e.target.value === 'true')}>
                <option value={true}>USD</option>
                <option value={false}>Shares</option>
              </select>
            </div>
            <div className='buySell__entryContainer'>
              <label className='amount-label'>Amount</label>
                <input
                  id="amount"
                  type="number"
                  className='amount-input'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step='any'
                />

            </div>
            <div className='buySell__marketPrice'>
              <div style={{"color": "var(--a__primary-green)"}}>Market Price</div><div>${stockData && stockData}</div>
            </div>
            <div>
                {buy && validationErrors.buyPowerInsufficient && <div className='form-error-handlers'>Buying Power insufficient</div>}
                {!buy && validationErrors.unableToSell && <div className='form-error-handlers'>{validationErrors.unableToSell}</div>}
            </div>
            <button type="submit" className='submit-button'>Review order</button>
            <div className='buySell__buyingPower'>
              {buy === true && `$${Number(portfolio.buying_power).toFixed(2)} available ⓘ`}
              {buy === false && Object.values(foundInvestment).length > 0 && Object.values(foundInvestment).length > 0 && (buyingOption ? `$${Number(foundInvestment.num_shares * stockData).toFixed(2)} availableⓘ` : `${foundInvestment.num_shares.toFixed(2)} shares availableⓘ`)}
            </div>
          </form>
        </div>
        <div className='ReviseWatchlistModalButton__container'>

          <OpenModalButton
              buttonText="Add to Lists"
              onItemClick={closeMenu}
              modalComponent={<ReviseWatchlistModal stockId={ticker} />}
              className='ReviseWatchlistModalButton'
              />
        </div>
      </section>
  )
};

export default BuySellForm;
