import {  SET_USER_LOCATION, SET_USER_LOCATION_COORDS, SET_DROPOFF_LOCATION, 
    SET_DROPOFF_LOCATION_COORDS, SET_PICKUP_LOCATION, SET_PICKUP_LOCATION_COORDS } from './constants';

const initialState = {
    userLocation:null,
    userLocationCoords:null,
    pickupLocation:'Enter Pickup Location',
    pickupLocationCoords:null,
    dropoffLocation:'Enter Dropoff Location',
    dropoffLocationCoords:null,
};

export const locationReducer = (state=initialState,action)=>{
    switch(action.type){
        case SET_USER_LOCATION:
            return {
               ...state,
                userLocation: action.data
            };
        case SET_USER_LOCATION_COORDS:
            return {
               ...state,
                userLocationCoords: action.data
            };
        case SET_PICKUP_LOCATION:
            return {
               ...state,
                pickupLocation: action.data
            };
        case SET_PICKUP_LOCATION_COORDS:
            return {
               ...state,
                pickupLocationCoords: action.data
            };
        case SET_DROPOFF_LOCATION:
            return {
               ...state,
                dropoffLocation: action.data
            };
        case SET_DROPOFF_LOCATION_COORDS:
            return {
               ...state,
                dropoffLocationCoords: action.data
            };
        default:
            return state;
    }
};