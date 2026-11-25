import { SET_CURRENT_SCREEN, SET_CURRENT_SCREEN_GO, SET_CURRENT_SCREEN_RIDER } from "./constants";

const initialState = {
  currentScreen: 'IntroScreen',
  currentScreenRider: 'home',
  currentScreenGo: 'home',
};

export const screenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_SCREEN:
      return {
        ...state,
        currentScreen: action.data,
      };
    case SET_CURRENT_SCREEN_RIDER:
      return {
        ...state,
        currentScreenRider: action.data,
      };
    case SET_CURRENT_SCREEN_GO:
      return {
        ...state,
        currentScreenGo: action.data,
      };
    default:
      return state;
  }
};