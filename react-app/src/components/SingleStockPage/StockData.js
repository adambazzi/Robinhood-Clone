


const fetchStockData = async (ticker, range) => {
    const apiKey = 'VPG2erwTW0gUxwEbKjL2PmqI8mlVLU6L';
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - range);
    const to = dateTo.toISOString().slice(0, 10);
    const from = dateFrom.toISOString().slice(0, 10);
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export default fetchStockData;
