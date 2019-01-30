import _ from 'lodash';

import CardInfo from '../../models/cardInfo';

const types = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  UPDATE_ZONE: 'UPDATE_ZONE',
  LOAD_CARDS: 'LOAD_CARDS',
};

const updatePlayer = (playerName, playerData) => (dispatch) => {
  dispatch({
    type: types.UPDATE_PLAYER,
    payload: {
      playerName,
      playerData,
    },
  });
};

const updateZone = (playerName, zoneName, zoneData) => (dispatch) => {
  dispatch({
    type: types.UPDATE_ZONE,
    payload: {
      playerName,
      zoneName,
      zoneData,
    },
  });
};

const loadCards = (cards) => (dispatch) => {
  const newCards = _.map(cards, (card) => new CardInfo(card));
  dispatch({
    type: types.LOAD_CARDS,
    payload: {
      newCards,
    },
  });
};

export default {
  types,
  updatePlayer,
  updateZone,
  loadCards,
};
