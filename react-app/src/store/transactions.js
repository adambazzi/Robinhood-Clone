const ADD_TRANSACTION = 'transactions/ADD_TRANSACTION'
const LOAD_TRANSACTIONS = 'transactions/LOAD_TRANSACTIONS'

// action creators
const addTransaction = payload => ({
    type: ADD_TRANSACTION,
    payload
})

const loadTransactions = payload => ({
    type: LOAD_TRANSACTIONS,
    payload
})

//Thunks
export const createTransaction = data => async dispatch => {
    const transactionResponse = await fetch(`/api/transactions`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (transactionResponse.ok) {
        const payload = await transactionResponse.json();
        dispatch(addTransaction(payload))
        return payload
    }
};

export const getTransactions = () => async dispatch => {
    const response = await fetch('/api/transactions');
    if (response.ok) {
        const payload = await response.json();
        dispatch(loadTransactions(payload))
    }
}

const initialState = {}

const transactionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        case LOAD_TRANSACTIONS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default transactionsReducer
