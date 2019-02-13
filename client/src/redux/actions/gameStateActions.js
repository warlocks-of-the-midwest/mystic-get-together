const types = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  UPDATE_CARD: 'UPDATE_CARD'
};

const updatePlayer = (playerName, playerData) => (dispatch) => {
  dispatch({
    type: types.UPDATE_PLAYER,
    payload: {
      playerName: playerName,
      playerData: playerData
    },
  });
};

const updateCard = (card) => (dispatch) => {
  dispatch({
    type: types.UPDATE_CARD,
    payload: {
      card: card
    },
  });
};

export default {
  types,
  updatePlayer,
  updateCard
};
