import React from 'react';
import { numberWithCommas } from '../../Utils';
import './TransactionComponent.css'

function TransactionComponent ({ transaction }) {

    let transactionClass
    transaction.total_expense > 0 ? transactionClass = 'purchased' : transactionClass = 'sold'
    const negativeOrPositive = transaction.total_expense > 0 ? '' : '-'

    return (
        <div className="transaction">
            <div className="transaction-details">
                <h4 className="transaction-details-title">{transaction.total_expense > 0 ? 'Purchased ' : 'Sold '} {transaction.stock_id}</h4>
                <h4 className={"transaction-details-amount " + transactionClass}>{negativeOrPositive}${numberWithCommas(Math.abs(transaction.total_expense))}</h4>
            </div>
            <div className="transaction-execution-date">{transaction.executed_at}</div>
        </div>
    )
}
export default TransactionComponent
