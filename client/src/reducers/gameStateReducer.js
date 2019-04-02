import CardInfo from '../models/cardInfo';
import Player from '../models/player';

export const GameActions = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  LOAD_PLAYERS: 'LOAD_PLAYERS',
  LOAD_CARDS: 'LOAD_CARDS',
};

const gameStateReducer = (state, action) => {
  switch (action.type) {
    case GameActions.LOAD_PLAYERS: {
      const newPlayers = action.payload.map((player) => new Player(player));
      return {
        ...state,
        players: newPlayers,
      };
    }
    case GameActions.LOAD_CARDS: {
      const newCards = action.payload.map((card) => new CardInfo(card));
      return {
        ...state,
        cards: newCards,
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
