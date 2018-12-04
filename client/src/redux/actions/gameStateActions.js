const types = {
  DECREMENT_LIFE: 'DECREMENT_LIFE',
};

const decrementLife = (a = -1) => (dispatch) => {
  console.log('actions');
  dispatch({
    type: types.DECREMENT_LIFE,
    payload: a,
  });
};

export default {
  types,
  decrementLife,
};
