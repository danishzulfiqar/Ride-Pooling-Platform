import { SetRidePhaseKey } from "./action";
import { SET_ROLE, SET_UID, SET_RIDE_PHASE_KEY, SET_NAVIGATION_PHASE } from "./constants";

const initialState = {
    role:null,
    uid:'',
    ridePhaseKey:'',
    navigationPhase:false,
};

export const appEssentialReducer = (state=initialState,action)=>{
    switch(action.type){
        case SET_ROLE:
            return {
                ...state,
                role: action.data
            };
        case SET_UID:
            return {
                ...state,
                uid: action.data
            };
        case SET_RIDE_PHASE_KEY:
            return {
                ...state,
                ridePhaseKey: action.data
            };
        case SET_NAVIGATION_PHASE:
            return {
                    ...state,
                    navigationPhase: action.data
                };
        default:
            return state;
    }
};