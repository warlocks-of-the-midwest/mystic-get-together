import gameActions from '../actions/gameStateActions';

//TODO make a complete initial state
//TODO update with correct schema
const initialState = {
  gameId: 'game1',
  Players: {
    player1: {
      life: 40,
      /*Zones: {
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
        },
        zone2: {
          card1: {
            "state.tapped": false,
            "state.owner": "player1",
            "state.zone": "zone2"
          },
          card2: {
            "state.tapped": false,
            "state.owner": "player1",
            "state.zone": "zone2"
          }
        }
      }*/
    }
  },
  Cards: {
    'f3bd773c-ff34-465d-b176-18e8873d28a7': {
      id: 'f3bd773c-ff34-465d-b176-18e8873d28a7',
      scryfall_id: '123',
      state: {
        controller: 'player1',
        is_token: true,
        owner: 'player1',
        position: 18,
        zone:'Exile',
        tapped: true
      }
    },
    '081b7099-3ff4-4216-ad4d-36787a8e6bc7': {
      id: '081b7099-3ff4-4216-ad4d-36787a8e6bc7',
      scryfall_id: '1234',
      state: {
        controller: 'player1',
        is_token: false,
        owner: 'player1',
        position: 17,
        zone:'Battlefield',
        tapped: false
      }
    },
    'card1': {
      id: 'card1',
      scryfall_id: '432',
      state: {
        controller: 'player1',
        is_token: false,
        owner: 'player1',
        position: 10,
        zone:'Battlefield',
        tapped: true
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
    /*case gameActions.types.UPDATE_ZONE: {
      let newPlayers = state.Players
      newPlayers[action.payload.playerName].Zones[action.payload.zoneName] = action.payload.zoneData
      return {
        ...state,
        Players: newPlayers
      };
    }*/
    case gameActions.types.UPDATE_CARD: {
      let newCards = state.Cards
      //TODO handling cards getting deleted/removed?
      newCards[action.payload.card.cardId] = action.payload.card
      return {
        ...state,
        Cards: newCards
      };
    }
    default:
      return state;
  }
};

export default gameStateReducer;
