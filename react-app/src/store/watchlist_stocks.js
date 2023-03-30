
export const createWatchlistStocks = data => async () => {
    if (!data.addTo.length) return
    const watchlistResponse = await fetch(`/api/watchlist_stocks`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (watchlistResponse.ok) {
        const payload = await watchlistResponse.json();
        return payload
    }
};

export const deleteWatchlistStocks = data => async () => {
    if (!data.remove.length) return
    const response = await fetch(`/api/watchlist_stocks`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    if (response.ok) {
      return {
        'message': 'watchlists deleted'
      }
    }
}
