import {combineReducers} from 'redux';
import {screenReducer} from './screenReducer';
import {appEssentialReducer} from './appEssentialsReducer';
import {locationReducer} from './locationReducer';

export default combineReducers({
  screen: screenReducer,
  appEssentials: appEssentialReducer,
  location: locationReducer,
});