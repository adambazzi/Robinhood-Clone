import React from "react";
import './TransferComponent.css'
import { numberWithCommas } from "../../Utils";

function TransferComponent ({ transfer }) {

    let transferClass
    {transfer.amount > 0 ? transferClass = 'deposit' : transferClass = 'withdrawal'}
    const negativeOrPositive = transfer.amount < 0 ? '-' : ''

    return (
        <div className="transfer">
            <div className="transfer-details">
                <h4 className="transfer-details-title">{transfer.amount > 0 ? 'Deposit to brokerage account' : 'Withdrawal from brokerage account'}</h4>
                <h4 className={"transfer-details-amount " + transferClass}>{negativeOrPositive}${numberWithCommas(Math.abs(transfer.amount))}</h4>
            </div>
            <div className="transfer-execution-date">{transfer.executed_at}</div>
        </div>
    )
}

export default TransferComponent;
