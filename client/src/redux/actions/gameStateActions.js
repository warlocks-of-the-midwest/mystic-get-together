import _ from 'lodash';

import CardInfo from '../../models/cardInfo';
import Player from '../../models/player';

const types = {
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  LOAD_PLAYERS: 'LOAD_PLAYERS',
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

const loadPlayers = (players) => (dispatch) => {
  const newPlayers = _.map(players, (player) => new Player(player));
  dispatch({
    type: types.LOAD_PLAYERS,
    payload: {
      players: newPlayers,
    },
  });
};

const loadCards = (cards) => (dispatch) => {
  const newCards = _.map(cards, (card) => new CardInfo(card));
  dispatch({
    type: types.LOAD_CARDS,
    payload: {
      cards: newCards,
    },
  });
};

const updateCard = (card) => (dispatch) => {
  dispatch({
    type: types.UPDATE_CARD,
    payload: {
      card,
    },
  });
};

export default {
  types,
  updatePlayer,
  loadPlayers,
  loadCards,
  updateCard,
};
