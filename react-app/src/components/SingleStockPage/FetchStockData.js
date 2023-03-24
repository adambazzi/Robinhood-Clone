


export const fetchStockData = async (ticker, range=0) => {
    const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
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

export const fetchStockDetails = async (symbol='TSLA') => {
    const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
    const url = `https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${apiKey}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const fetchClosingCost = async (ticker='TSLA') => {
    const apiKey = process.env.REACT_APP_POLYGON_API_KEY;

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results[0].c;
}