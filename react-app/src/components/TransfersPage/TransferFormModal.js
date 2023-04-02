import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTransfer } from "../../store/transfers";
import { editPortfolio } from "../../store/portfolio";
import { useModal } from "../../context/Modal";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TransferFormModal.css'

function TransferForm({ portfolio }) {
  const [amount, setAmount] = useState("");
  const [transferType, setTransferType] = useState("transfer");
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();

    const transferAmount = parseFloat(amount);

    // Validate input
    const errors = {};

    if (!transferAmount || transferAmount <= 0) {
      errors.amount = "Please enter a valid transfer amount.";
    }

    if (transferType === "withdrawal" && transferAmount > Number(portfolio.buying_power)) {
      errors.amount = "You do not have enough buying power for this withdrawal.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Create transfer and update portfolio
    const transfer = {
      amount: transferType === 'transfer' ? transferAmount : transferAmount * -1,
      portfolioId: portfolio.id,
    };

    dispatch(createTransfer(transfer)).then(() => {
      const updatedPortfolio = {
        buyingPower: Number(portfolio.buying_power) + transferAmount
      };
      dispatch(editPortfolio(updatedPortfolio, portfolio.id));
    });

    closeModal()
  };

  return (
    <div className="transfer-form-container">
        <div><h2 className="transfer-form__heading">Transfer Money</h2><button className="close-button" onClick={() => closeModal()}><FontAwesomeIcon icon={faTimes} /></button></div>
        <form className="transfer-form__form" onSubmit={handleSubmit}>
            <label className="transfer-type-label">
                Select transfer type:
                <select
                className="transfer-type-select"
                name="transferType"
                value={transferType}
                onChange={(e) => setTransferType(e.target.value)}
                >
                <option value="transfer">Transfer</option>
                <option value="withdrawal">Withdrawal</option>
                </select>
            </label>
            <label className="amount-label">
                Enter an amount:
                <input
                className="transfer-form__input"
                type="number"
                name="quantity"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                />
            </label>
            {validationErrors.amount && <div className="error">{validationErrors.amount}</div>}
            <div className="buying-power">Current Buying Power: ${portfolio.buying_power}</div>
            <button className="transfer-form__button" type="submit">Submit</button>
        </form>
    </div>
  );
}

export default TransferForm;
