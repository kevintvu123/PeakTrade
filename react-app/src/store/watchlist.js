//types
const GET_USER_WATCHLIST = "watchlist/getUserWatchlist"

//action creators
const getUserWatchlist = (payload) => {
    return {
        type: GET_USER_WATCHLIST,
        payload
    }
}

//thunks
export const getUserWatchlistThunk = () => async (dispatch) => {
    const response = await fetch("/api/watchlists/current");

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserWatchlist(data))
        return data;
    } else {
        throw response
    }
}

export const postWatchlistThunk = (body) => async (dispatch) => {
    const response = await fetch("/api/watchlists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserWatchlistThunk())
        return data
    } else {
        throw response;
    }
}

export const postWatchlistStockThunk = (body, watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/stocks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserWatchlistThunk());
        return data
    } else {
        throw response
    }
}

export const updateWatchlistThunk = (body, watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserWatchlistThunk())
        return data
    } else {
        throw response
    }
}

export const deleteWatchlistThunk = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: "DELETE",
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserWatchlistThunk());
        return data
    } else {
        throw response;
    }
}

export const deleteWatchlistStockThunk = (watchlistStockId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/watchlist-stocks/${watchlistStockId}`, {
        method: "DELETE",
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserWatchlistThunk());
        return data
    } else {
        throw response;
    }
}

const normalizeWatchlists = (watchlistsArr) => {
    const watchlistsObj = {}
    watchlistsArr.forEach((watchlist) => (
        watchlistsObj[watchlist.id] = watchlist
    ))
    return watchlistsObj
}

const watchlistReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_USER_WATCHLIST:
            const responseObj = {}
            responseObj["watchlistsArr"] = action.payload.watchlists
            const watchlistObj = normalizeWatchlists(action.payload.watchlists)
            responseObj["watchlists"] = watchlistObj
            newState = { ...responseObj }
            return newState
        default:
            return state;
    }
}

export default watchlistReducer
