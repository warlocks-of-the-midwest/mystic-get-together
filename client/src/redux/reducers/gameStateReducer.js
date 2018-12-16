import gameActions from '../actions/gameStateActions';

//TODO make a complete initial state
const initialState = {
  Players: {
    player1: {
      life: 40,
      Zones: {
        zone1: {
          card1: {
            "state.tapped": false,
            "state.owner": "player1",
            "state.zone": "zone1"
          },
          card2: {
            "state.tapped": false,
            "state.owner": "player1",
            "state.zone": "zone1"
          }
        }
      }
    }
  }
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameActions.types.UPDATE_PLAYER: {
      let newPlayers = state.Players
      newPlayers[action.payload.playerName] = {...newPlayers[action.payload.playerName], ...action.payload.playerData};
      return {
        ...state,
        Players: newPlayers
      };
    }
    case gameActions.types.UPDATE_ZONE: {
      let newPlayers = state.Players
      newPlayers[action.payload.playerName].Zones[action.payload.zoneName] = action.payload.zoneData
      return {
        ...state,
        Players: newPlayers
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
