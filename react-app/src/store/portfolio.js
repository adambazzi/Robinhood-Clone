const LOAD_PORTFOLIO = 'portfolio/LOAD_PORTFOLIO'
const EDIT_PORTFOLIO = 'portfolio/EDIT_PORTFOLIO'
const CREATE_PORTFOLIO = 'portfolio/CREATE_PORTFOLIO'
const REMOVE_PORTFOLIOS = 'portfolio/REMOVE_PORTFOLIOS'
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

const removePortfolios = () => ({
    type: REMOVE_PORTFOLIOS
})

//Thunks
export const createPortfolio = () => async dispatch => {
    const data = {
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

export const getPortfolio = (userId) => async dispatch => {
    const response = await fetch(`/api/portfolio/?userId=${userId}`);
    if(response.ok) {
      const payload = await response.json()
      dispatch(loadPortfolio(payload))
    }
}

export const clearPortfolios = () => async dispatch => {
    dispatch(removePortfolios())
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
        case REMOVE_PORTFOLIOS:
            return {}
        default:
            return state;
    }
}

export default portfolioReducer;
