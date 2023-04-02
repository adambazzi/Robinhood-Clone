const LOAD_PORTFOLIO_HISTORIES = 'portfolio/LOAD_PORTFOLIO_HISTORIES'
const REMOVE_PORTFOLIO_HISTORIES =  'portfolio/REMOVE_PORTFOLIO_HISTORIES'
// action creators
const loadPortfolioHistories = payload => ({
    type: LOAD_PORTFOLIO_HISTORIES,
    payload
})
const removePortfolioHistories = () => ({
    type: REMOVE_PORTFOLIO_HISTORIES
})



//Thunks
export const getPortfolioHistories = (portfolioId) => async dispatch => {
    const response = await fetch(`/api/portfolio_histories/?portfolioId=${portfolioId}`);
    if(response.ok) {
      const payload = await response.json()
      dispatch(loadPortfolioHistories(payload))
    }
}


export const createPortfolioHistory = (data) => async dispatch => {
    const response = await fetch(`/api/portfolio_histories`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        await response.json();
    }
};

export const clearPorfolioHistories = () => async dispatch => {
    dispatch(removePortfolioHistories())
}



const initialState = {}


const portfolioHistoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PORTFOLIO_HISTORIES:
            return {
                ...action.payload.reduce(
                    (portfolioHistories, portfolioHistory) => ({
                        ...portfolioHistories,
                        [portfolioHistory.id]: portfolioHistory
                    }),
                    {}
                )
            }
        case REMOVE_PORTFOLIO_HISTORIES:
            return {}

        default:
            return state;
    }
}

export default portfolioHistoryReducer;
