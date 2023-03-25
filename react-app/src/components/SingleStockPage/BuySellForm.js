

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createInvestment, editInvestment, getInvestments } from '../../store/investments';
import { getPortfolio, editPortfolio } from '../../store/portfolio';
import { createTransaction } from '../../store/transactions';
import { fetchClosingCost } from './FetchStockData'
import './BuySellForm.css'

const BuySellForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    // The 'buyingOption' dropdown allows the user to choose whether they want to buy in USD or shares.
    const [buyingOption, setBuyingOption] = useState(true)
    // The 'buy' option determines if the user is buying or selling shares
    const [buy, setBuy] = useState(true)
    const [amount, setAmount] = useState(0)
    let { ticker } = useParams()
    ticker = ticker.toUpperCase()


    const [validationErrors, setValidationErrors] = useState({
        buyPowerInsufficient: '',
        unableToSell: '',
        inputCannotBeNegative: ''
    })
    const user = useSelector(state => state.session.user)
    const investments = useSelector(state => state.investments)
    const portfolio = useSelector(state => state.portfolio)

    useEffect(() => {
      dispatch(getPortfolio(user.id));
    }, [dispatch, user.id]);

    useEffect(() => {
      if (portfolio.id) {
        dispatch(getInvestments(ticker, portfolio.id));
      }
    }, [dispatch, portfolio.id, ticker]);

    let foundInvestment;
    for (let key in investments) {
      if (investments[key].stock_id === ticker) {
        foundInvestment = investments[key];
        break;
      }
    }

    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Retrieve stock data using the ticker symbol
        const stockData = await fetchClosingCost(ticker);

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
              ? foundInvestment.num_shares + numShares
              : numShares)
            : (foundInvestment
              ? foundInvestment.num_shares - numShares
              : numShares),
              totalValue: foundInvestment ? foundInvestment.total_value + totalExpense : totalExpense,
          },
          portfolio: {
            userId: user.id,
            buyingPower: portfolio.buying_power - totalExpense
          },
        };

        // Perform validation checks on the payload data
        const errors = {};
        if (payload.transaction.totalExpense > portfolio.buying_power && buy === true) {
            errors.buyPowerInsufficient = "Buy power insufficient";
        }
        if (buy === true && payload.transaction.totalExpense <= 0) {
            errors.inputCannotBeNegative = "Input cannot be negative or 0";
        }
        if (buy === false && payload.transaction.totalExpense >= 0) {
            errors.inputCannotBeNegative = "Input cannot be negative or 0";
        }
        if (payload.investment.totalValue < 0) {
            errors.unableToSell = "Unable to sell, insufficient funds";
        }

        // If there are no validation errors, dispatch the necessary actions to update the investment, portfolio, and transaction data
        if (!Object.values(errors).length) {
          // Check if the investment exists in the Redux store
          const investmentExists = !!foundInvestment;
          let createdTransactionId;

          // Create or edit the investment data
          if (investmentExists) {
            dispatch(editInvestment(payload.investment, foundInvestment.id));
          } else {
            dispatch(createInvestment(payload.investment));
          }

          // Edit the portfolio data
          dispatch(editPortfolio(payload.portfolio, portfolio.id));

          // Create the transaction data
          let newTransaction = dispatch(createTransaction(payload.transaction));
          createdTransactionId = newTransaction.id;


          history.push(`/`)
        } else {
          // If there are validation errors, set the validationErrors state to the error messages
          setValidationErrors(errors);
        }
      };




  return (
      <section id='spot-form-section' className='spot-form-section'>
        <div id='spot-form-container' className='spot-form-container'>
          <form className='stock__buyForm' onSubmit={handleSubmit}>
            <div className='buy-sell-buttons-container'>
              <div className='buy-sell-buttons'>
                <button className={`buy-button ${buy ? 'underline' : ''}`} onClick={() => setBuy(true)}>Buy</button>
                <button className={`sell-button ${buy ? '' : 'underline'}`} onClick={() => setBuy(false)}>Sell</button>
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
                />
            </div>
            <button type="submit" className='submit-button'>Review order</button>
            <div className='buySell__buyingPower'>
              {buy ? `$${Number(portfolio.buying_power).toFixed(2)} available ⓘ` : `$${Number(foundInvestment.total_value).toFixed(2)} available`}
            </div>
          </form>
        </div>
      </section>
  )
};

export default BuySellForm;
