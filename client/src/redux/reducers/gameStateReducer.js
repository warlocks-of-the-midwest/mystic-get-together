import gameActions from '../actions/gameStateActions';

// TODO make a complete initial state
const initialState = {
  cards: [],
  gameId: 'game1',
  Players: {
    player1: {
      life: 40,
      Zones: {
        zone1: {
          card1: {
            'state.tapped': false,
            'state.owner': 'player1',
            'state.zone': 'zone1',
          },
          card2: {
            'state.tapped': false,
            'state.owner': 'player1',
            'state.zone': 'zone1',
          },
        },
        zone2: {
          card1: {
            'state.tapped': false,
            'state.owner': 'player1',
            'state.zone': 'zone2',
          },
          card2: {
            'state.tapped': false,
            'state.owner': 'player1',
            'state.zone': 'zone2',
          },
        },
      },
    },
  },
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameActions.types.UPDATE_PLAYER: {
      const newPlayers = state.Players;
      newPlayers[action.payload.playerName] = { ...newPlayers[action.payload.playerName], ...action.payload.playerData };
      return {
        ...state,
        Players: newPlayers,
      };
    }
    case gameActions.types.UPDATE_ZONE: {
      const newPlayers = state.Players;
      newPlayers[action.payload.playerName].Zones[action.payload.zoneName] = action.payload.zoneData;
      return {
        ...state,
        Players: newPlayers,
      };
    }
    case gameActions.types.LOAD_CARDS: {
      const { newCards } = action.payload;
      return {
        ...state,
        cards: newCards,
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
