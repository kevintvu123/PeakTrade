
//types
const GET_USER_GROUP = "group/getUserGroup"

//action creators
const getUserGroup = (payload) => {
    return {
        type: GET_USER_GROUP,
        payload
    }
}

//thunks
export const getUserGroupThunk = () => async (dispatch) => {
    const response = await fetch("/api/groups/current");

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserGroup(data))
        return data;
    } else {
        throw response;
    }
}

export const postGroupThunk = (body) => async (dispatch) => {
    const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserGroupThunk());
        return data
    } else {
        throw response;
    }
}

export const postGroupMemberThunk = (body, groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserGroupThunk());
        return data;
    } else {
        const data = await response.json()
        throw data
    }
}

export const updateGroupThunk = (body, groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserGroupThunk());
        return data
    } else {
        throw response;
    }
}

export const deleteGroupThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserGroupThunk());
        return data
    } else {
        throw response;
    }
}

export const deleteGroupMemberThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/users`, {
        method: "DELETE",
    })

    if (response.ok) {
        const data = await response.json();
        await dispatch(getUserGroupThunk());
        return data;
    } else {
        throw response
    }
}


const normalizeGroups = (groupsArr) => {
    const groupsObj = {}
    groupsArr.forEach((group) => (
        groupsObj[group.id] = group
    ))
    return groupsObj
}

const groupReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_USER_GROUP:
            const responseObj = {}
            responseObj["groupsArr"] = action.payload.groups
            const stocksObj = normalizeGroups(action.payload.groups)
            responseObj["groups"] = stocksObj
            newState = { ...responseObj }
            return newState
        default:
            return state;
    }
}

export default groupReducer