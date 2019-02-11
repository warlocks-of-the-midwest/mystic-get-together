import gameActions from '../actions/gameStateActions';

const initialState = {
  cards: [],
  players: [],
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameActions.types.LOAD_PLAYERS: {
      const { players } = action.payload;
      return {
        ...state,
        players,
      };
    }
    case gameActions.types.LOAD_CARDS: {
      const { cards } = action.payload;
      return {
        ...state,
        cards,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
