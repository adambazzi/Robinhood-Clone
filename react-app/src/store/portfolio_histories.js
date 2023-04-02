const LOAD_PORTFOLIO_HISTORIES = 'portfolio/LOAD_PORTFOLIO_HISTORIES'
// action creators
const loadPortfolioHistories = payload => ({
    type: LOAD_PORTFOLIO_HISTORIES,
    payload
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

        default:
            return state;
    }
}

export default portfolioHistoryReducer;
