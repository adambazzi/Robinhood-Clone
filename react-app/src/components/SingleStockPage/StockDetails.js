


const fetchStockDetails = async (symbol='TSLA') => {
    const apiKey = 'YIsjtlgOpCfZx63PAtYxx4H68H3PklSp';
    const url = `https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${apiKey}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export default fetchStockDetails;
