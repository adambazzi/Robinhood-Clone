
const LOAD_FILTERED_STOCKS = 'stocks/LOAD_FILTERED_STOCKS'
const REMOVE_STOCKS = 'stocks/REMOVE_STOCKS'

// action creators


const loadFilteredStocks = payload => ({
    type: LOAD_FILTERED_STOCKS,
    payload
})

const removeStocks = payload => ({
    type: REMOVE_STOCKS
})

//Thunks

export const getFilteredStocks = (entry) => async dispatch => {

    const response = await fetch(`/api/stocks/?entry=${entry}`);
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadFilteredStocks(payload))
    }
}

export const clearStocks = () => async dispatch => {
    dispatch(removeStocks())
}


const initialState = {

}

const stocksReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_FILTERED_STOCKS:
            return {
                ...action.payload.reduce(
                    (stocks, stock) => ({
                        ...stocks,
                        [stock.id]: stock
                    }),
                    {}
                )
            }
        case REMOVE_STOCKS:
            return {}
        default:
            return state;
    }
}

export default stocksReducer;
