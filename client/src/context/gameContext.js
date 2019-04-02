import React, { useReducer, useEffect } from 'react';
import _ from 'lodash';

import gameStateReducer, { GameActions } from '../reducers/gameStateReducer';
import * as sdk from '../js-sdk/sdk';

export const GameContext = React.createContext();

const GAME_ID = 'FtNnLrn6SugiK8C4naOx'; // hard-coded for debugging

const initialGameState = {
  cards: [],
  players: [],
};

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);

  // TODO move loadCards into gameStateReducer.js
  const loadCards = (data) => {
    const cards = _.map(_.keys(data), (cardId) => data[cardId]);
    const scryfallIds = _.map(cards, (card) => _.get(card, 'scryfall_id', null));

    const requests = _.map(scryfallIds, async (scryfallId) => {
      let response = await fetch(`https://api.scryfall.com/cards/${scryfallId}?format=json`);
      const scryfallJson = await response.json();
      const { id, set_uri, ...scryfallData } = scryfallJson;

      response = await fetch(set_uri);
      const setJson = await response.json();
      const { icon_svg_uri } = setJson;

      return Promise.resolve({ icon_svg_uri, ...scryfallData });
    });

    Promise.all(requests)
      .then((sData) => {
        dispatch({ type: GameActions.LOAD_CARDS, payload: _.merge(cards, sData) });
      });
  };

  const cardUpdate = (data) => {
    // console.log('listening');
  };

  const playerUpdate = (data) => {
    // console.log('listening');
  };

  useEffect(() => {
    const init = async () => {
      const playerPromise = sdk.loadPlayers(GAME_ID);
      const cardPromise = sdk.loadCards(GAME_ID);

      const [playerData, cardData] = await Promise.all([playerPromise, cardPromise]);

      _.forEach(playerData, (player) => {
        const { uid } = player;
        sdk.listenToPlayer(GAME_ID, uid, playerUpdate);
      });
      dispatch({ type: GameActions.LOAD_PLAYERS, payload: playerData });

      loadCards(cardData);
      _.forEach(cardData, (card) => {
        const { id } = card;
        sdk.listenToCard(GAME_ID, id, cardUpdate);
      });
    };

    init();
  }, []);

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
};
