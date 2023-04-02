
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
import { createPortfolioHistory } from '../../store/portfolio_histories';
import './BuySellForm.css';

const BuySellForm = () => {
  const dispatch = useDispatch();
  // The 'buyingOption' dropdown allows the user to choose whether they want to buy in USD or shares.
  const [buyingOption, setBuyingOption] = useState(true);
  // The 'buy' option determines if the user is buying or selling shares
  const [buy, setBuy] = useState(true);
  const [amount, setAmount] = useState(0);
  const [stockData, setStockData] = useState(0)
  let { ticker } = useParams();
  ticker = ticker.toUpperCase();
  const [validationErrors, setValidationErrors] = useState({
    buyPowerInsufficient: '',
    unableToSell: '',
    inputCannotBeNegative: ''
  });

  const user = useSelector(state => state.session.user);
  const investments = useSelector(state => state.investments);
  const portfolio = useSelector(state => state.portfolio);

  // Fetch portfolio data when the component mounts
  useEffect(() => {
    dispatch(getPortfolio(Number(user.id)));
  }, [dispatch, user.id]);

  // Fetch investment data when the portfolio data is loaded or the ticker changes
  useEffect(() => {
    if (portfolio.id) {
      dispatch(getInvestments(Number(portfolio.id)));
    }
  }, [dispatch, portfolio.id]);

  // Fetch investment data and stock data when the portfolio data or ticker changes
  useEffect(() => {
    const fetchInvestmentData = async () => {
      if (portfolio.id) {
        dispatch(getInvestments(Number(portfolio.id)));
      }
    }
    const fetchStockData = async () => {
      let value = await fetchClosingCost(ticker);
      setStockData(Number(value));
    }

    Promise.all([fetchInvestmentData(), fetchStockData()])
      .catch(error => console.error(error));
  }, [dispatch, portfolio.id, ticker]);

  // Find the investment for the current ticker, if it exists
  let foundInvestment;
  for (let key in investments) {
    if (investments[Number(key)].stock_id === ticker) {
      foundInvestment = investments[Number(key)];
      break;
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


    // Calculate the number of shares, total expense, and average price based on the user's inputs and stock data
    const numAmount = Number(amount)
    const numShares = buyingOption === false ? numAmount : numAmount / stockData;
    const totalExpense = buy ? stockData * numShares : -stockData * numShares;
    const averagePrice = stockData;


    // Construct the payload object for the request
    const payload = {
      transaction: {
        portfolioId: portfolio.id,
        stockId: ticker,
        numShares: numShares,
        averagePrice: averagePrice,
        totalExpense: totalExpense,
      },
      investment: {
        portfolioId: portfolio.id,
        stockId: ticker,
        numShares: buy
          ? (foundInvestment
            ? Number(foundInvestment.num_shares) + numShares
            : numShares)
          : (foundInvestment
            ? Number(foundInvestment.num_shares) - numShares
            : numShares),
      },
      portfolio: {
        userId: user.id,
        buyingPower: portfolio.buying_power - totalExpense
      }
    };

    // Perform validation checks on the payload data
    const errors = {};
    if (payload.transaction.totalExpense > portfolio.buying_power && buy === true) {
      errors.buyPowerInsufficient = "Buy power insufficient";
    }
    if (buy === true && Number(payload.transaction.totalExpense.toFixed(2)) <= 0) {
      errors.inputCannotBeNegative = "Input cannot be negative or 0";
    }

    if (buy === false && payload.transaction.totalExpense >= 0) {
        errors.inputCannotBeNegative = "Input cannot be negative or 0";
    }
    if (payload.investment.numShares < 0) {
        errors.unableToSell = "Unable to sell, insufficient funds";
    }

        // If there are no validation errors, dispatch the necessary actions to update the investment, portfolio, and transaction data
        if (!Object.values(errors).length) {
          // Check if the investment exists in the Redux store
          const investmentExists = !!foundInvestment;
          let createdTransactionId;

          const verifyInvestmentDelete = Number((payload.investment.numShares * payload.transaction.averagePrice).toFixed(2))
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
          const portfolioHistory = {
            portfolioId: portfolio.id,
            value: Number(payload.investment.numShares) * Number(averagePrice)
          }
          dispatch(createPortfolioHistory(portfolioHistory))

          createdTransactionId = newTransaction.id;
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

  return (
      <section className='stock-form-section'>
        <div className='stock-form-container'>
          <form className='stock__buyForm' onSubmit={handleSubmit}>
            <div className='buy-sell-buttons-container'>
              <div className='buy-sell-buttons'>
                <button type="button" className={`buy-button ${buy ? 'underline' : ''}`} onClick={() => setBuy(true)}>Buy</button>
                {foundInvestment && <button type="button" className={`sell-button ${buy ? '' : 'underline'}`} onClick={() => setBuy(false)}>Sell</button>}
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
                  type="decimal"
                  className='amount-input'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                />
            </div>
            <div className='buySell__marketPrice'>
              <div style={{"color": "var(--a__primary-green)"}}>Market Price</div><div>${stockData && stockData}</div>
            </div>
            <div>
              {/* Total Cost {buyingOption ? 'Total Cost ' + } */}
            </div>
            <button type="submit" className='submit-button'>Review order</button>
            <div className='buySell__buyingPower'>
              {buy ? `$${Number(portfolio.buying_power).toFixed(2)} available ⓘ` : (buyingOption ? `$${Number(foundInvestment.num_shares * stockData).toFixed(2)} availableⓘ` : `${foundInvestment.num_shares.toFixed(2)} shares availableⓘ`)}
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
