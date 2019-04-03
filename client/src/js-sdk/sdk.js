import axios from 'axios';
import uuidv4 from 'uuid/v4';
import db, { FIREBASE_FUNCTION_BASE_URL } from './fire.js';

// Listeners
export function listenToCard(gameId, cardId, callback) {
  db.doc(`Games/${gameId}/Cards/${cardId}`)
    .onSnapshot((doc) => {
      callback(doc.data());
    });
}

// Expects an array of queries in the following format:
// queries = [
//   query0 = [ "state.controller", "==", "player1" ],
//   query1 = [ "state.power", ">=", 5 ],
//   query2 = [ "state.is_token", "!=", true ]
// ]
export function listenToCardsByQuery(gameId, queries, callback) {
  let queryRef = db.collection(`Games/${gameId}/Cards`);
  queries.forEach((query) => {
    queryRef = queryRef.where(query[0], query[1], query[2]);
  });
  queryRef.onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      callback(doc.data());
    });
  });
}

// Listens to all cards in a game
export function listenToGame(gameId, callback) {
  db.collection(`Games/${gameId}/Cards`).onSnapshot(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        callback(doc.data());
      });
    }
  );
}

export function listenToPlayer(gameId, player, callback) {
  db.doc(`Games/${gameId}/Players/${player}`)
    .onSnapshot((doc) => {
      callback(doc.data());
    });
}

export async function loadPlayers(gameId) {
  const querySnapshot = await db.collection(`Games/${gameId}/Players`).get();
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
}

export async function loadCards(gameId) {
  const querySnapshot = await db.collection(`Games/${gameId}/Cards`).get();
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
}

// Card functions
async function getCardFromId(gameId, cardId) {
  const cardDoc = await db.doc(`Games/${gameId}/Cards/${cardId}`).get();
  return cardDoc.data();
}

export async function moveCardToZone(gameId, cardId, targetZone) {
  const card = await getCardFromId(gameId, cardId);
  if (card.state.zone === targetZone) {
    return;
  }
  card.state.zone = targetZone;
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

function setSingleCardPosition(gameId, card, newPosition) {
  card.state.position = newPosition;
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export async function setCardPosition(gameId, cardId, newPosition) {
  const card = await getCardFromId(gameId, cardId);
  const previousPosition = card.state.position;
  db.collection(`Games/${gameId}/Cards/`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const otherCardData = doc.data();
      // Move all other cards that are now below this one down.
      if (otherCardData.id !== card.id) {
        const cardPosition = otherCardData.state.position;
        if (cardPosition > previousPosition && cardPosition <= newPosition) {
          setSingleCardPosition(gameId, otherCardData, cardPosition - 1);
        } else if (cardPosition >= newPosition && cardPosition < previousPosition) {
          setSingleCardPosition(gameId, otherCardData, cardPosition + 1);
        }
      } else {
        setSingleCardPosition(gameId, card, newPosition);
      }
    });
  });
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  let currentIndex = array.length; let temporaryValue; let
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export async function shuffle(gameId, targetPlayerId) {
  const numCards = 100;
  const newOrdering = [];
  for (let i = 0; i < numCards; i++) {
    newOrdering.push(i);
  }
  shuffleArray(newOrdering);

  let i = 0;
  db.collection(`Games/${gameId}/Cards/`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const card = doc.data();
      if (card.state.controller === targetPlayerId && card.state.zone === 'Library') { // Only shuffle library cards
        setSingleCardPosition(gameId, card, newOrdering[i]);
        i++;
      }
    });
  });
}

export function remove(gameId, cardId) {
  db.doc(`Games/${gameId}/Cards/${cardId}`).delete();
}

export async function changeController(gameId, cardId, targetPlayer, targetZone) {
  const card = await getCardFromId(gameId, cardId);
  card.state.controller = targetPlayer;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

export async function tap(gameId, cardId) {
  const card = await getCardFromId(gameId, cardId);
  card.state.tapped = true;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

export async function untap(gameId, cardId) {
  const card = await getCardFromId(gameId, cardId);
  card.state.tapped = false;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

export async function clone(gameId, cardId, shouldCreateToken) {
  const card = await getCardFromId(gameId, cardId);
  // deep copy the card
  const cardCopy = JSON.parse(JSON.stringify(card));
  cardCopy.state.is_token = shouldCreateToken;
  cardCopy.id = uuidv4();
  db.doc(`Games/${gameId}/Cards/${cardCopy.id}`).set(cardCopy);
}

export async function flip(gameId, cardId) {
  const card = await getCardFromId(gameId, cardId);
  card.state.face_up = !card.state.face_up;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

export function createToken(gameId, tokenScryfallId, targetPlayer, targetZone, power, toughness) {
  const newCard = {
    id: uuidv4(),
    scryfall_id: tokenScryfallId,
    'state.owner': targetPlayer,
    'state.controller': targetPlayer,
    'state.zone': targetZone,
    'state.position': 0,
    'state.tapped': false,
    'state.face_up': true,
    'state.clone_of': false,
    'state.is_morph': false,
    'state.is_token': true,
    'state.power': power,
    'state.toughness': toughness,
    'attachments.counters': {},
    'attachments.permanents': {},
  };
  db.doc(`Games/${gameId}/Cards/${newCard.id}`).set(newCard);
}

export async function setCardCounters(gameId, cardId, counterType, numCounters) {
  const card = await getCardFromId(gameId, cardId);
  const currentCounters = card.attachments.counters;
  currentCounters[counterType] = numCounters;
  card.attachments.counters = currentCounters;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

export async function setAttachedPermanents(gameId, cardId, attachedPermanents) {
  const card = await getCardFromId(gameId, cardId);
  card.attachments.permanents = attachedPermanents;
  db.doc(`Games/${gameId}/Cards/${cardId}`).set(card);
}

// Player functions
export function updateLife(gameId, player, newLife) {
  db.doc(`Games/${gameId}/Players/${player}`)
    .update({
      life: newLife,
    });
}

export function setPlayerCounters(gameId, player, counterType, numCounters) {
  let currentCounters;
  db.doc(`Games/${gameId}/Players/${player}`).get().then((doc) => {
    currentCounters = doc.data().counters;
    currentCounters[counterType] = numCounters;
    db.doc(`Games/${gameId}/Players/${player}`)
      .update({
        counters: currentCounters,
      });
  });
}

// TODO we don't currently store any data for game status like this
export function loseGame(player) {
}
export function winGame(player) {
}
export function drawGame() {
}

// Deck functions
export function getAvailableDecks(user) {
  let deckData;
  return db.doc(`Users/${user}`).get().then((doc) => {
    deckData = doc.data().decks;
    return Object.keys(deckData);
  });
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
 * @param {string} uid The uid of the player, e.g. xxxxxxxxxxxxx
 * @param {string} uri The uri of the deck, e.g. https://www.mtggoldfish.com/deck/1325288
 *
 * @returns nothing
 */
export async function importDeck(uid, uri) {
  try {
    const res = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/importDeckFunction`, {
      uid,
      uri,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex) {
    console.log(ex);
    return ex;
  }
}

/**
 * This wraps the 'parseDeckFunction', which parses a deck from MTGGoldfish.
 *
 * @param {string} uri The uri of the deck, e.g. https://www.mtggoldfish.com/deck/1325288
 *
 * @returns The parsed deck
 */
export async function parseDeck(uri) {
  try {
    const res = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/parseDeckFunction`, {
      uri,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
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
      ...include && { include },
    },
  });
  return response.data;
}

// Game functions

/**
 * This wraps the 'hostGameFunction', which creates a new game containing
 * the specified player, with her board state initialized using the specified
 * deck.
 *
 * @param {string} uid The name of the player, e.g. xxxxxxxx
 * @param {string} deckId The ID of the deck belonging to the given player
 *
 * @returns {string} The game ID
 */
export async function hostGame(uid, deckId) {
  try {
    const res = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/hostGameFunction`, {
      uid,
      deckId,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex) {
    console.log(ex);
    return (ex);
  }
}

/**
 * This wraps the 'joinGameFunction', which joins an existing game by adding
 * the specified player, intializing her board state using the specified deck.
 *
 * @param {string} gameId The game ID, as returned by 'hostGame'
 * @param {string} uid The name of the player, e.g. xxxxxxxxx
 * @param {string} deckId The ID of the deck belonging to the given player
 *
 * @returns nothing
 */
export async function joinGame(uid, deckId, gameId) {
  try {
    const res = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/joinFunction`, {
      uid,
      deckId,
      gameId,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
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
  try {
    const res = await axios.post(`${FIREBASE_FUNCTION_BASE_URL}/hostGameFunction`, {
      gameId,
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
}
