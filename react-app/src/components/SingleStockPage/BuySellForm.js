

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createInvestment, editInvestment, getInvestments } from '../../store/investments';
import { getPortfolio, editPortfolio } from '../../store/portfolio';
import { createTransaction } from '../../store/transactions';
import { fetchClosingCost } from './FetchStockData'

const BuySellForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [buyingOption, setBuyingOption] = useState(true)
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

        let foundInvestment;
        for (let key in investments) {
          if (investments[key].stock_id === ticker) {
            foundInvestment = investments[key];
            break;
          }
        }



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
            numShares: foundInvestment ? foundInvestment.num_shares + (buyingOption === false ? numAmount : numAmount / stockData) : (buyingOption === false ? numAmount : numAmount / stockData),
            totalValue: foundInvestment ? foundInvestment.total_value + averagePrice * numShares : averagePrice * numShares,
          },
          portfolio: {
            userId: user.id,
            buyingPower: portfolio.buying_power - totalExpense,
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
        if (payload.investment.totalValue < payload.transaction.totalExpense && buy === false) {
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


          history.push(`/stocks/${ticker}`)
        } else {
          // If there are validation errors, set the validationErrors state to the error messages
          setValidationErrors(errors);
        }
      };




  return (
    <section id='spot-form-section'>
        <div id='spot-form-container'>
            <h2>Buy</h2>
            <form className='stock__buyForm' onSubmit={handleSubmit}>
                <button onClick={() => setBuy(true)}>Buy</button>
                <button onClick={() => setBuy(false)}>Sell</button>
                <label>Buy in
                    <select id="buyForm__dropdown_buyingOption" value={buyingOption} onChange={(e) => setBuyingOption(e.target.value)}>
                        <option value={true}>USD</option>
                        <option value={false}>Shares</option>
                    </select>
                </label>
                <label>Amount
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    </section>
  )
};

export default BuySellForm;