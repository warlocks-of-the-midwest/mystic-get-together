import CardInfo from "../models/cardInfo";

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
      const currentCards = state.cards;

      const changedCardIndex = currentCards.findIndex(
        (element) => element.id === action.payload.card.id
      );

      if (changedCardIndex < 0) { return state; }

      console.log(`Changing zone of card ${action.payload.card.id}`
        + ` from ${currentCards[0].state.zone} to`
        + ` ${action.payload.card.state.zone}`);

      currentCards[changedCardIndex].setState(action.payload.card.state);

      return {
        ...state,
        cards: currentCards,
      };
    }
    case GameActions.UPDATE_PLAYER: {
      const currentPlayers = state.players;

      const changedPlayerIndex = currentPlayers.findIndex(
        (element) => element.uid === action.payload.player.uid
      );

      if (changedPlayerIndex < 0) { return state; }

      currentPlayers[changedPlayerIndex] = action.payload.player;
      return {
        ...state,
        players: currentPlayers,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
