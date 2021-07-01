import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

const initialUserState = {
    currentUser: null,
    isLoading: true
};

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false


}

const initialColorState = {
    primaryColor: "#000",
    secondaryColor: "#eee"
}


const user_reducer = (state = initialUserState, action) => {

    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}

const channel_reducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel

            }

        default: return state;
    }
}

const colors_reducer = (state = initialColorState, action) => {
    switch (action.type) {
        case actionTypes.SET_COLORS:
            return {
                ...state,
                primaryColor: action.payload.primaryColor,
                secondaryColor: action.payload.secondaryColor
            }
        default: return state;
    }
}



const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colors: colors_reducer
})

export default rootReducer;