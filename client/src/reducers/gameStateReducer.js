export const GameActions = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
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
      const newCards = state.Cards;
      // TODO handling cards getting deleted/removed?
      newCards[action.payload.card.cardId] = action.payload.card;
      return {
        ...state,
        Cards: newCards,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
