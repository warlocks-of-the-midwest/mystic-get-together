const types = {
  DECREMENT_LIFE: 'DECREMENT_LIFE',
  SET_LIFE: 'SET_LIFE'
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

export default {
  types,
  decrementLife,
  setLife
};
