import db, { FIREBASE_FUNCTION_BASE_URL } from './fire.js';
import firebase from 'firebase'
import axios from 'axios';
import uuidv4 from 'uuid/v4';

// Listeners
export function listenToCard(gameId, card, callback) {
  db.doc(`Games/${gameId}/Cards/${card.id}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function listenToPlayer(gameId, player, callback) {
  db.doc(`Games/${gameId}/Players/${player}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

// Game functions
// Card functions
export function moveCardToZone(gameId, card, targetZone) {
  if (card.state.zone === targetZone) {
    return;
  }

  remove(gameId, card); // remove from current zone before moving
  card.state.zone = targetZone
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card)
}

function setSingleCardPosition(gameId, card, newPosition) {
  card.state.position = newPosition
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card)
}

export function setCardPosition(gameId, card, newPosition) {
  const previousPosition = card.state.position
  db.collection(`Games/${gameId}/Cards/`).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const otherCardData = doc.data();
      // Move all other cards that are now below this one down.
      if (otherCardData.id !== card.id) {
        const cardPosition = otherCardData.state.position
        if (cardPosition > previousPosition && cardPosition <= newPosition) {
          setSingleCardPosition(gameId, otherCardData, cardPosition - 1)
        }
        else if (cardPosition >= newPosition && cardPosition < previousPosition) {
          setSingleCardPosition(gameId, otherCardData, cardPosition + 1)
        }
      } else {
        setSingleCardPosition(gameId, card, newPosition)
      }
    });
  });
}

export function shuffle(gameId, targetPlayer) {
  const numCards = 100;
  let newOrdering = [];
  for (let i = 0; i < numCards; i++) {
    newOrdering.push(i);
  }
  newOrdering = newOrdering.OrderBy(a => uuidv4());

  let i = 0;
  db.collection(`Games/${gameId}/Cards/`).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const card = doc.data();
      if (card.state.zone === "Library") { // Only shuffle library cards
        setSingleCardPosition(gameId, card, newOrdering[i])
        i++;
      }
    });
  });
}

export function remove(gameId, card) {
  db.doc(`Games/${gameId}/Cards/${card.id}`).delete()
}

export function changeController(gameId, card, targetPlayer, targetZone) {
  // First remove card from previous controller's zone
  remove(card);
  card.state.controller = targetPlayer
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export function tap(gameId, card) {
  card.state.tapped = true
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export function untap(gameId, card) {
  card.state.tapped = false
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export function clone(gameId, card, shouldCreateToken) {
  // deep copy the card
  let cardCopy = JSON.parse(JSON.stringify(card))
  cardCopy.state.is_token = shouldCreateToken
  cardCopy.id = uuidv4();
  db.doc(`Games/${gameId}/Cards/${cardCopy.id}`).set(cardCopy);
}

export function flip(gameId, card) {
  card.state.face_up = !card.state.face_up
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export function createToken(gameId, tokenScryfallId, targetPlayer, targetZone, power, toughness) {
  const newCard = {
    'id': uuidv4(),
    'scryfall_id': tokenScryfallId,
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
    'attachments.permanents': {}
  }
  db.doc(`Games/${gameId}/Cards/${newCard.id}`).set(newCard);
}

export function setCardCounters(gameId, card, counterType, numCounters) {
  let currentCounters = card.attachments.counters
  currentCounters[counterType] = numCounters
  card.attachments.counters = currentCounters
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

export function setAttachedPermanents(gameId, card, attachedPermanents) {
  card.attachments.permanents = attachedPermanents
  db.doc(`Games/${gameId}/Cards/${card.id}`).set(card);
}

//Player functions
export function updateLife(gameId, player, newLife) {
  db.doc(`Games/${gameId}/Players/${player}`)
    .update({
      life: newLife
    })
}

export function setPlayerCounters(gameId, player, counterType, numCounters) {
  let currentCounters;
  db.doc(`Games/${gameId}/Players/${player}`).get().then(function(doc) {
    currentCounters = doc.data().counters
    currentCounters[counterType] = numCounters
    db.doc(`Games/${gameId}/Players/${player}`)
      .update({
        counters: currentCounters
      })
  });
}

//TODO we don't currently store any data for game status like this
export function loseGame(player) {
}
export function winGame(player) {
}
export function drawGame() {
}

//Deck functions
export function getAvailableDecks(user) {
  let deckData;
  db.doc(`Users/${user}`).get().then(function(doc) {
    deckData = doc.data().decks
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
