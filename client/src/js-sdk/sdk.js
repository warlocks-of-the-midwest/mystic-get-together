import db, { FIREBASE_FUNCTION_BASE_URL } from './fire.js';
import axios from 'axios';

// Listeners
export function listenToZone(player, zone, callback) {
  db.doc(`Games/game1/Players/${player}/Zones/${zone}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function listenToPlayer(player, callback) {
  db.doc(`Games/game1/Players/${player}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

// Game functions
export function tap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = true
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function untap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = false
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function updateLife(player, newLife) {
  db.doc(`Games/game1/Players/${player}`)
    .update({
      life: newLife
    })
}

// Methods for interacting with Cloud Functions
// TODO: Once we get Firebase Auth setup, we should convert our Functions
// to Callables (https://firebase.google.com/docs/functions/callable) and use
// the Firebase provided mechanism to call them, which will handle auth with
// the Function

/**
 * This wraps the 'importDeckFunction', which imports a deck from MTGGoldfish
 * for the given player.
 *
 * @param {string} player The name of the player, e.g. eric
 * @param {string} uri The uri of the deck, e.g. https://www.mtggoldfish.com/deck/1325288
 *
 * @returns nothing
 */
export async function importDeck(player, uri) {
  await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/importDeckFunction`, {
    params: {
        player,
        uri
    }
  });
  return;
}

/**
 * This wraps the 'parseDeckFunction', which parses a deck from MTGGoldfish.
 *
 * @param {string} uri The uri of the deck, e.g. https://www.mtggoldfish.com/deck/1325288
 *
 * @returns The parsed deck
 */
export async function parseDeck(uri) {
  const response = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/parseDeckFunction`, {
    params: {
        uri
    }
  });
  return response.data;
}

/**
 * This wraps the 'populateDeckFunction', which returns bulk Scryfall data
 * for a deck.
 *
 * @param {string} player The name of the player, e.g. eric
 * @param {string} deckId The ID of the deck belonging to the given player
 * @param {...any} include If provided, filter the Scryfall data to only include
 * the named fields. Dot notation is supported.
 *
 * @returns Bulk data for all cards in the specified deck
 */
export async function populateDeck(player, deckId, ...include) {
  const response = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/populateDeckFunction`, {
    params: {
        player,
        deckId,
        ...include && { include }
    }
  });
  return response.data;
}

/**
 * This wraps the 'hostGameFunction', which creates a new game containing
 * the specified player, with her board state initialized using the specified
 * deck.
 *
 * @param {string} player The name of the player, e.g. eric
 * @param {string} deckId The ID of the deck belonging to the given player
 *
 * @returns {string} The game ID
 */
export async function hostGame(player, deckId) {
  const response = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/hostGameFunction`, {
    params: {
        player,
        deckId
    }
  });
  return response.headers['x-gameid'];
}

/**
 * This wraps the 'joinGameFunction', which joins an existing game by adding
 * the specified player, intializing her board state using the specified deck.
 *
 * @param {string} gameId The game ID, as returned by 'hostGame'
 * @param {string} player The name of the player, e.g. eric
 * @param {string} deckId The ID of the deck belonging to the given player
 *
 * @returns nothing
 */
export async function joinGame(gameId, player, deckId) {
  await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/joinGameFunction`, {
    params: {
        gameId,
        player,
        deckId
    }
  });
  return;
}

/**
 * This wraps the 'startGameFunction', which starts the game by setting the
 * 'turn_order' attribute on the Game.
 *
 * @param {string} gameId The game ID, as returned by 'hostGame'
 *
 * @returns nothing
 */
export async function startGame(gameId) {
  await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/startGameFunction`, {
    params: {
        gameId
    }
  });
  return;
}
