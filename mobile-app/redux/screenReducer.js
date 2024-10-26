import { SET_CURRENT_SCREEN, SET_CURRENT_SCREEN_GO, RESET_SCREEN, RESET_SCREEN_GO } from "./constants";

const initialState = {
  currentScreen: 'IntroScreen',
  currentScreenGo: null,
};

export const screenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_SCREEN:
      return {
        ...state,
        currentScreen: action.data,
      };
    case SET_CURRENT_SCREEN_GO:
      return {
        ...state,
        currentScreenGo: action.data,
      };
    case RESET_SCREEN:
      return {
          currentScreen: null,
        };
    case RESET_SCREEN_GO:
      return {
            currentScreenGo: null,
          };
    default:
      return state;
  }
};