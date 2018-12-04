import { combineReducers } from 'redux';
import gameStateReducer from './reducers/gameStateReducer';

export default combineReducers({
  gameState: gameStateReducer,
});
