const ADD_INVESTMENT = 'investments/ADD_INVESTMENT'
const EDIT_INVESTMENT = 'investments/EDIT_INVESTMENT'
const LOAD_INVESTMENTS = 'investments/LOAD_INVESTMENTS'
const REMOVE_INVESTMENT = 'investments/REMOVE_INVESTMENT'
const REMOVE_INVESTMENTS = 'investments/REMOVE_INVESTMENTS'
// action creators
const addInvestment = payload => ({
    type: ADD_INVESTMENT,
    payload
})

const reviseInvestment = payload => ({
    type: EDIT_INVESTMENT,
    payload
})

const loadInvestments = payload => ({
    type: LOAD_INVESTMENTS,
    payload
})

const removeInvestment = payload => ({
    type: REMOVE_INVESTMENT,
    payload
})

const removeInvestments = () => ({
    type: REMOVE_INVESTMENTS
})

//Thunks
export const createInvestment = data => async dispatch => {
    const investmentResponse = await fetch(`/api/investments`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (investmentResponse.ok) {
        const payload = await investmentResponse.json();
        dispatch(addInvestment(payload))
    }
};

export const editInvestment = (data, investmentId) => async dispatch => {
    const investmentResponse = await fetch(`/api/investments/${investmentId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (investmentResponse.ok) {
        const payload = await investmentResponse.json();
        dispatch(reviseInvestment(payload))
    }
}

export const getInvestments = (portfolioId) => async dispatch => {
    const response = await fetch(`/api/investments/?portfolioId=${portfolioId}`);
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadInvestments(payload))
    }
}

export const deleteInvestment = (investmentId) => async dispatch => {
    const response = await fetch(`/api/investments/${investmentId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (response.ok) {
      dispatch(removeInvestment(investmentId))
    }
}

export const clearInvestments = () => async dispatch => {
    dispatch(removeInvestments())
}

let initialState = {

}

const investmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_INVESTMENT:
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        case EDIT_INVESTMENT:
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload
                }
            }
            case LOAD_INVESTMENTS:
                return {
                    ...action.payload.reduce(
                        (investments, investment) => ({
                            ...investments,
                            [investment.id]: investment
                        }),
                        {}
                    )
                }
            case REMOVE_INVESTMENT:
                const newState = { ...state };
                delete newState[action.payload];
                return newState;
            case REMOVE_INVESTMENTS:
                return {}
        default:
            return state;
    }
}

export default investmentsReducer;
