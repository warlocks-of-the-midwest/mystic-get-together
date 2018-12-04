import gameActions from '../actions/gameStateActions';

const gameStateReducer = (state = {}, action) => {
  console.log('reducer');
  switch (action.type) {
    case gameActions.types.DECREMENT_LIFE:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default gameStateReducer;
