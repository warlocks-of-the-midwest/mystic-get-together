const types = {
  DECREMENT_LIFE: 'DECREMENT_LIFE',
};

const decrementLife = (amount = -1) => (dispatch) => {
  dispatch({
    type: types.DECREMENT_LIFE,
    payload: amount,
  });
};

export default {
  types,
  decrementLife,
};
