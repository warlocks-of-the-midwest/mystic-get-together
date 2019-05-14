export const GameActions = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  UPDATE_CARD: 'UPDATE_CARD',
  LOAD_PLAYERS: 'LOAD_PLAYERS',
  LOAD_CARDS: 'LOAD_CARDS',
};

const gameStateReducer = (state, action) => {
  switch (action.type) {
    case GameActions.LOAD_PLAYERS: {
      return {
        ...state,
        players: action.payload,
      };
    }
    case GameActions.LOAD_CARDS: {
      return {
        ...state,
        cards: action.payload,
      };
    }
    case GameActions.UPDATE_CARD: {
      return {
        ...state,
        cards: action.payload,
      };
    }
    case GameActions.UPDATE_PLAYER: {
      return {
        ...state,
        players: action.payload,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
