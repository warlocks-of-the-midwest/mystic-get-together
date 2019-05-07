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
      const updatedCards = state.cards;

      const changedCardIndex = updatedCards.findIndex(
        (element) => element.id === action.payload.card.id
      );

      if (changedCardIndex < 0) { return state; }

      console.log(`Changing zone of card ${action.payload.card.id}`
        + ` from ${updatedCards[changedCardIndex].state.zone} to`
        + ` ${action.payload.card.state.zone}`);

      updatedCards[changedCardIndex].state = action.payload.card.state;

      return {
        ...state,
        cards: updatedCards,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
