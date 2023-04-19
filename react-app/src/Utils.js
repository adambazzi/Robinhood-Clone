

const apiKey = 'ztsOEV3luptJb7idNc36awUpUevpRncX';
const today = new Date();
const dateString = today.toISOString().slice(0, 10);
export const fetchStockChartData = async (ticker, range=0) => {
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

// Get information on single stock page about the business
export const fetchStockDetails = async (symbol) => {
    const url = `https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${apiKey}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

// Get the most recent closing cost
export const fetchClosingCost = async (ticker) => {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`
    const response = await fetch(url);
    const data = await response.json();

    return Number(data.results[0].c);
}

// Get the most recent stock date including closing cost, opening cost etc
export const fetchStockData = async (ticker) => {

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results[0];
}

// Get news related to a single stock
export const fetchTickerNews = async (ticker) => {
    const url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&order=asc&limit=10&sort=published_utc&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.results;
}

//Convert a number to a string with commas
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// fetches the latest quote for the Nasdaq index from the Polygon API and returns the results.
export const fetchNasdaq = async () => {
    try {
        const url = `https://api.polygon.io/v1/open-close/QQQ/${dateString}?apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//fetches the latest price for Bitcoin in USD from the Polygon API and returns the results.
export const fetchBitcoin = async () => {
    try {
        const url = `https://api.polygon.io/v2/aggs/ticker/BTC/prev?adjusted=true&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//fetches the latest financial news articles and headlines from the Polygon API and returns the results
export const fetchGeneralNews = async () => {
    try {
        const url = `https://api.polygon.io/v2/reference/news?published_utc=${dateString}&order=desc&limit=15&sort=published_utc&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
