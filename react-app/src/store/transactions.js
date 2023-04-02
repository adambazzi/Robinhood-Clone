const ADD_TRANSACTION = 'transactions/ADD_TRANSACTION'
const LOAD_TRANSACTIONS = 'transactions/LOAD_TRANSACTIONS'
const REMOVE_TRANSACTIONS = 'transactions/REMOVE_TRANSACTIONS'

// action creators
const addTransaction = payload => ({
    type: ADD_TRANSACTION,
    payload
})

const loadTransactions = payload => ({
    type: LOAD_TRANSACTIONS,
    payload
})

const removeTransactions = () => ({
    type: REMOVE_TRANSACTIONS
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
    }
};

export const getTransactions = (portfolioId) => async dispatch => {
    const response = await fetch(`/api/transactions/?portfolioId=${portfolioId}`);
    if (response.ok) {
        const payload = await response.json();
        dispatch(loadTransactions(payload))
    }
}

export const clearTransactions = () => async dispatch => {
    dispatch(removeTransactions())
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
        case REMOVE_TRANSACTIONS:
            return {}
        default:
            return state;
    }
}

export default transactionsReducer
