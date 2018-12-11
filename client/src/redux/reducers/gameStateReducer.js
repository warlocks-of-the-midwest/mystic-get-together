import gameActions from '../actions/gameStateActions';

const initialState = {
  life: 40,
  zone1: {
    card1: {
      "state.tapped": false
    },
    card2: {
      "state.tapped": false
    }
  }
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameActions.types.DECREMENT_LIFE: {
      const newLife = state.life + action.payload;
      return {
        ...state,
        life: newLife,
      };
    }
    case gameActions.types.SET_LIFE: {
      return {
        ...state,
        life: action.payload,
      };
    }
    case gameActions.types.UPDATE_ZONE: {
      //const currentZone = state.zone1;
      //const newZone = currentZone[action.payload]['state.tapped'] = true
      //TODO actually use zone name
      delete action.payload.name
      console.log(action.payload)
      return {
        ...state,
        zone1: action.payload
      };
    }
    /*case gameActions.types.UNTAP: {
      const currentZone = state.zone1;
      const newZone = currentZone[action.payload]['state.tapped'] = false
      return {
        ...state,
        zone1: newZone
      };
    }*/
    default:
      return state;
  }
};

export default gameStateReducer;
