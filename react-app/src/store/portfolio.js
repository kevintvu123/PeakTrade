
//types
const GET_USER_PORTFOLIO = "portfolio/getUserPortfolio"

//action creators
const getUserPortfolio = (payload) => {
    return {
        type: GET_USER_PORTFOLIO,
        payload
    };
};

//thunks
export const getUserPortfolioThunk = () => async (dispatch) => {
    const response = await fetch("/api/transactions");

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserPortfolio(data))
        return data;
    } else {
        throw response;
    }
};

export const postTransactionThunk = (body) => async (dispatch) => {
    const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserPortfolioThunk());
        return data
    } else {
        throw response;
    }
}

const normalizeStocks = (stocksArr) => {
    const stocksObj = {};
    stocksArr.forEach((stock) => (
        stocksObj[stock.ticker] = stock
    ))
    return stocksObj
}

const portfolioReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_USER_PORTFOLIO:
            const responseObj = action.payload
            const stocksObj = normalizeStocks(action.payload.stocks)
            responseObj["stocks"] = stocksObj
            newState = { ...state, ...responseObj }
            return newState
        default:
            return state;
    }
}

export default portfolioReducer;