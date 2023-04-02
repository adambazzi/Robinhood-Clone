const ADD_TRANSFER = 'transfers/ADD_TRANSFER'
const LOAD_TRANSFERS = 'transfers/LOAD_TRANSFERS'

// action creators
const addTransfer = payload => ({
    type: ADD_TRANSFER,
    payload
})

const loadTransfers = payload => ({
    type: LOAD_TRANSFERS,
    payload
})


//Thunks
export const createTransfer = data => async dispatch => {
    const transferResponse = await fetch(`/api/transfers`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (transferResponse.ok) {
        const payload = await transferResponse.json();
        dispatch(addTransfer(payload))
    }
};

export const getTransfers = (portfolioId) => async dispatch => {
    const response = await fetch(`/api/transfers/?portfolioId=${portfolioId}`);
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadTransfers(payload))
    }
}


const initialState = {

}

const transfersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSFER:
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        case LOAD_TRANSFERS:
            return {
                ...action.payload.reduce(
                    (transfers, transfer) => ({
                        ...transfers,
                        [transfer.id]: transfer
                    }),
                    {}
                )
            }
        default:
            return state;
    }
}

export default transfersReducer;
