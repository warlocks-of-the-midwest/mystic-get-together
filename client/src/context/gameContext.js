import React, { useReducer, useEffect, useRef } from 'react';
import _ from 'lodash';

import gameStateReducer, { GameActions } from '../reducers/gameStateReducer';
import * as sdk from '../js-sdk/sdk';
import CardInfo from '../models/cardInfo';
import Player from '../models/player';

export const GameContext = React.createContext();

const initialGameState = {
  gameId: null,
  cards: [],
  players: [],
};

export const GameProvider = (props) => {
  const { children } = props;
  let { gameId } = props.match.params;

  // for debugging
  if (props.match.path === '/board' || props.match.path === '/fullbattlefield') {
    gameId = 'FtNnLrn6SugiK8C4naOx';
  }

  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);

  // cardUpdate()/playerUpdate() will only see the value of gameState and
  // props as they are during the initial call of useEffect.init() -- so
  // this reference allows these functions to access the current state
  const cardsRef = useRef(gameState.cards);
  const playersRef = useRef(gameState.players);

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
        const mergedCards = _.map(_.merge(cards, sData), (card) => new CardInfo(card));
        dispatch({ type: GameActions.LOAD_CARDS, payload: mergedCards });
      });
  };

  const cardUpdate = (data) => {
    const updatedCards = cardsRef.current.slice();

    const updatedIndex = updatedCards.findIndex(
      (element) => element.id === data.id
    );

    if (updatedIndex < 0) {
      return;
    }

    /*
    console.log(`Changing zone of card ${data.id} from `
    + `${updatedCards[updatedIndex].state.zone} to `
    + `${data.state.zone}`);
    */

    updatedCards[updatedIndex].state = data.state;

    dispatch({ type: GameActions.UPDATE_CARD, payload: updatedCards });
  };

  const playerUpdate = (data) => {
    const updatedPlayers = playersRef.current.slice();

    const updatedIndex = updatedPlayers.findIndex(
      (element) => element.id === data.id
    );

    if (updatedIndex < 0) {
      return;
    }

    updatedPlayers[updatedIndex] = data;

    dispatch({ type: GameActions.UPDATE_PLAYER, payload: updatedPlayers });
  };

  useEffect(() => {
    const init = async () => {
      const playerPromise = sdk.loadPlayers(gameId);
      const cardPromise = sdk.loadCards(gameId);

      const [playerData, cardData] = await Promise.all([playerPromise, cardPromise]);

      _.forEach(playerData, (player) => {
        const { uid } = player;
        sdk.listenToPlayer(gameId, uid, playerUpdate);
      });
      dispatch({ type: GameActions.LOAD_PLAYERS, payload: _.map(playerData, (player) => new Player(player)) });

      _.forEach(cardData, (card) => {
        const { id } = card;
        sdk.listenToCard(gameId, id, cardUpdate);
      });
      loadCards(cardData);
    };

    init();
  }, []);

  // Make sure that cardsRef and playersRef stay up-to-date with game state
  useEffect(
    () => {
      cardsRef.current = gameState.cards;
      playersRef.current = gameState.players;
    }, [gameState]
  );

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
};
