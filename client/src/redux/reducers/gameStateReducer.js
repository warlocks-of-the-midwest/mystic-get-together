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
    case gameActions.types.UPDATE_CARD: {
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
