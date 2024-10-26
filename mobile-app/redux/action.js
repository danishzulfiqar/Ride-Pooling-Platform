import { SET_CURRENT_SCREEN, SET_ROLE, SET_UID, SET_CURRENT_SCREEN_GO, 
  SET_USER_LOCATION, SET_USER_LOCATION_COORDS, SET_DROPOFF_LOCATION, 
  SET_DROPOFF_LOCATION_COORDS, SET_PICKUP_LOCATION, SET_PICKUP_LOCATION_COORDS, 
  SET_RIDE_PHASE_KEY, SET_NAVIGATION_PHASE, RESET_SCREEN, RESET_SCREEN_GO } from './constants';


export const SetCurrentScreen = (screenName) => {
  return {
    type: SET_CURRENT_SCREEN,
    data: screenName,
  };
};

export const SetCurrentScreenGo = (screenName) => {
  return {
    type: SET_CURRENT_SCREEN_GO,
    data: screenName,
  };
};

export const SetRole = (role) => {
  return {
    type: SET_ROLE,
    data: role,
  };
};

export const SetUid = (uid) => {
  return {
    type: SET_UID,
    data: uid,
  };
};

export const SetUserLocation = (location) => {
  return {
    type: SET_USER_LOCATION,
    data: location,
  };
};

export const SetUserLocationCoords = (location) => {
  return {
    type: SET_USER_LOCATION_COORDS,
    data: location,
  };
};

export const SetPickupLocation = (location) => {
  return {
    type: SET_PICKUP_LOCATION,
    data: location,
  };
};

export const SetPickupLocationCoords = (location) => {
  return {
    type: SET_PICKUP_LOCATION_COORDS,
    data: location,
  };
};

export const SetDropoffLocation = (location) => {
  return {
    type: SET_DROPOFF_LOCATION,
    data: location,
  };
};

export const SetDropoffLocationCoords = (location) => {
  return {
    type: SET_DROPOFF_LOCATION_COORDS,
    data: location,
  };
};

export const SetRidePhaseKey = (phaseKey) => {
  return {
    type: SET_RIDE_PHASE_KEY,
    data: phaseKey,
  };
};

export const SetNavigationPhase = (phase) => {
  return {
    type: SET_NAVIGATION_PHASE,
    data: phase,
  };
};

export const ResetScreen = () => {
  return {
    type: RESET_SCREEN,
  };
};

export const ResetScreenGo = () => {
  return {
    type: RESET_SCREEN_GO,
  };
};