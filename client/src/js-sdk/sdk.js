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

//TODO make the game id determined dynamically, not hard coded

// Game functions
// Card functions
export function moveCardToZone(card, targetZone) {
  var playerName = card["state.owner"];
  card["state.zone"] = targetZone
  db.doc(`Games/game1/Players/${playerName}/Zones/${targetZone}`)
    .update({
      [card.id]: card
    })
}

export function setCardPosition(card, newPosition) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  var currentZoneData;
  db.doc(`Games/game1/Players/${player}/Zones/${zoneName}`).get().then(function(doc) {
    currentZoneData = doc.data();
  });
  
  // Move all other cards that are now below this one down.
  var previousPosition = card["state.position"]
  for (var cardId in currentZoneData) {
    if (currentZoneData.hasOwnProperty(cardId) && cardId != card.id) {
      if (cardId != card.id) {
        var cardPosition = currentZoneData[cardId]["state.position"]
        if (cardPosition >= newPosition && cardPosition < previousPosition) {
          currentZoneData[cardId]["state.position"] = cardPosition + 1;
        }
      } else {
        currentZoneData[cardId]["state.position"] = newPosition
      }
    }
  }

  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .set(currentZoneData);
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
function shuffleArray(array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

export function shuffle(targetPlayer, targetZone) {
  //TODO move all other cards in the zone
  var currentZoneData;
  db.doc(`Games/game1/Players/${targetPlayer}/Zones/${targetZone}`).get().then(function(doc) {
    currentZoneData = doc.data();
  });

  var numCards = Object.keys(currentZoneData).length
  var newOrdering = [];
  for (var i = 0; i < numCards; i++) {
    newOrdering.push(i);
  }
  shuffleArray(newOrdering)
  
  // Move all cards to shuffled positions
  var i = 0;
  for (var cardId in currentZoneData) {
    if (currentZoneData.hasOwnProperty(cardId)) {
      currentZoneData[cardId]["state.position"] = newOrdering[i];
      i++;
    }
  }

  db.doc(`Games/game1/Players/${targetPlayer}/Zones/${targetZone}`)
    .set(currentZoneData);
}

export function remove(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.position"] = newPosition
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: firebase.firestore.FieldValue.delete()
  });
}

export function changeController(card, targetPlayer, targetZone) {
  // First remove card from previous controller's zone
  remove(card);
  card["state.controller"] = targetPlayer
  db.doc(`Games/game1/Players/${targetPlayer}/Zones/${targetZone}`)
    .update({
      [card.id]: card
  });
}

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

export function clone(card, shouldCreateToken) {
  // deep copy the card
  var cardCopy = JSON.parse(JSON.stringify(card))
  cardCopy["state.is_token"] = shouldCreateToken
  // TODO how do we plan to create/set card id? just incremented numbers?
  // They need to be unique across all cards, so not sure what do do here now.
  cardCopy.id = "newCardId"
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [cardCopy.id]: cardCopy
    })
}

export function flip(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.face_up"] = !card["state.face_up"]
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function createToken(tokenScryfallId, targetPlayer, targetZone, power, toughness) {
  //TODO uhh not sure
  //TODO fill in parameters in google drive doc once done with this
}

export function setCounters(card, counterType, numCounters) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  var currentCounters = card["attachments.counters"]
  currentCounters[counterType] = numCounters
  card["attachments.counters"] = currentCounters
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function setAttachedPermanents(card, attachedPermanents) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["attachments.permanents"] = attachedPermanents
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

//Player functions
export function updateLife(player, newLife) {
  db.doc(`Games/game1/Players/${player}`)
    .update({
      life: newLife
    })
}

export function setCounters(player, counterType, numCounters) {
  var currentCounters;
  db.doc(`Games/game1/Players/${player}`).get().then(function(doc) {
    currentCounters = doc.data().counters
  });
  currentCounters[counterType] = numCounters
  db.doc(`Games/game1/Players/${player}`)
    .update({
      counters: currentCounters
    })
}

//TODO I don't believe there is anything for the game status in our schema currently
// we can just ignore these for now if we decide not to include them
export function loseGame(player) {
}
export function winGame(player) {
}
export function drawGame() {
}

//Deck functions
export function getAvailableDecks(user) {
  var deckData;
  db.doc(`Users/${user}`).get().then(function(doc) {
    deckData = doc.data().decks
  });
  return Object.keys(deckData);
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