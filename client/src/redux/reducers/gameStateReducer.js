import gameActions from '../actions/gameStateActions';

const initialState = {
  life: 40,
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameActions.types.DECREMENT_LIFE: {
      const newLife = state.life + action.payload;
      return {
        ...state,
        life: newLife,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
