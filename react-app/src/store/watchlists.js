const ADD_WATCHLIST = 'watchlists/ADD_WATCHLIST'
const EDIT_WATCHLIST = 'watchlists/EDIT_WATCHLIST'
const LOAD_WATCHLISTS = 'watchlists/LOAD_WATCHLISTS'
const REMOVE_WATCHLIST = 'watchlists/REMOVE_WATCHLIST'
const REMOVE_WATCHLISTS = 'watchlists/REMOVE_WATCHLISTS'

// action creators
const addWatchlist = payload => ({
    type: ADD_WATCHLIST,
    payload
})

const reviseWatchlist = payload => ({
    type: EDIT_WATCHLIST,
    payload
})

const loadWatchlists = payload => ({
    type: LOAD_WATCHLISTS,
    payload
})

const removeWatchlist = payload => ({
    type: REMOVE_WATCHLIST,
    payload
})

const removeWatchlists = () => ({
    type: REMOVE_WATCHLISTS
})

//Thunks
export const createWatchlist = data => async dispatch => {
    const watchlistResponse = await fetch(`/api/watchlists`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (watchlistResponse.ok) {
        const payload = await watchlistResponse.json();
        dispatch(addWatchlist(payload))
    }
};

export const editWatchlist = (data, watchlistId) => async dispatch => {
    const watchlistResponse = await fetch(`/api/watchlists/${watchlistId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (watchlistResponse.ok) {
        const payload = await watchlistResponse.json();
        dispatch(reviseWatchlist(payload))
    }
}

export const getWatchlists = () => async dispatch => {
    const response = await fetch('/api/watchlists');
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadWatchlists(payload))
    }
}

export const deleteWatchlist = (watchlistId) => async dispatch => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (response.ok) {
      dispatch(removeWatchlist(watchlistId))
    }
}

export const clearWatchlists = () => async dispatch => {
    dispatch(removeWatchlists())
  }


const initialState = {

}

const watchlistsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_WATCHLIST:
            return {
                ...state,
                [action.payload.id]: action.payload
            }
        case EDIT_WATCHLIST:
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload
                }
            }
        case LOAD_WATCHLISTS:
            return {
                ...action.payload.reduce(
                    (watchlists, watchlist) => ({
                        ...watchlists,
                        [watchlist.id]: watchlist
                    }),
                    {}
                )
            }
        case REMOVE_WATCHLIST:
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        case REMOVE_WATCHLISTS:
            return {};
        default:
            return state;
    }
}

export default watchlistsReducer;
