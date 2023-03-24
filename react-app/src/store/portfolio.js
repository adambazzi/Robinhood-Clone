const LOAD_PORTFOLIO = 'portfolio/LOAD_PORTFOLIO'
const EDIT_PORTFOLIO = 'portfolio/EDIT_PORTFOLIO'
const CREATE_PORTFOLIO = 'portfolio/CREATE_PORTFOLIO'

// action creators
const loadPortfolio = payload => ({
    type: LOAD_PORTFOLIO,
    payload
})

const revisePortfolio = payload => ({
    type: EDIT_PORTFOLIO,
    payload
})

const addPortfolio = payload => ({
    type: CREATE_PORTFOLIO,
    payload
})

//Thunks
export const createPortfolio = userId => async dispatch => {
    const data = {
        'id': userId,
        'userId': userId,
        'buyingPower': 0,
    }
    const portfolioResponse = await fetch(`/api/portfolio`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (portfolioResponse.ok) {
        const payload = await portfolioResponse.json();
        dispatch(addPortfolio(payload))
    }
};

export const editPortfolio = (data, portfolioId) => async dispatch => {
    const portfolioResponse = await fetch(`/api/portfolio/${portfolioId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (portfolioResponse.ok) {
        const payload = await portfolioResponse.json();
        dispatch(revisePortfolio(payload))
    }
}

export const getPortfolio = (portfolioId) => async dispatch => {
    const response = await fetch(`/api/portfolio/${portfolioId}`);
    if(response.ok) {
      const payload = await response.json()
      dispatch(loadPortfolio(payload))
    }
}

const initialState = {}


const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PORTFOLIO:
            return {
                ...state,
                ...action.payload
            }
        case EDIT_PORTFOLIO:
            return {
                ...state,
                ...action.payload
            }
        case LOAD_PORTFOLIO:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default portfolioReducer;
