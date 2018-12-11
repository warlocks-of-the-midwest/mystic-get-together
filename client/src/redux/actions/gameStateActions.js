const types = {
  DECREMENT_LIFE: 'DECREMENT_LIFE',
  SET_LIFE: 'SET_LIFE',
  UPDATE_ZONE: 'UPDATE_ZONE'
};

const decrementLife = (amount = -1) => (dispatch) => {
  dispatch({
    type: types.DECREMENT_LIFE,
    payload: amount,
  });
};

const setLife = (newLife = 1) => (dispatch) => {
  dispatch({
    type: types.SET_LIFE,
    payload: newLife,
  });
};

const updateZone = (zoneName = "zone1", zoneData = {}) => (dispatch) => {
  zoneData.name = zoneName
  dispatch({
    type: types.UPDATE_ZONE,
    payload: zoneData,
  });
};

/*const untap = (cardName = "card1") => (dispatch) => {
  dispatch({
    type: types.UNTAP,
    payload: cardName,
  });
};*/

export default {
  types,
  decrementLife,
  setLife,
  updateZone
};
