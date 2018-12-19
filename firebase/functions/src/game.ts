import * as Firestore from '@google-cloud/firestore';
import * as functions from 'firebase-functions';
const uuidv4 = require('uuid/v4');
import * as createError from 'http-errors';
import * as _ from 'lodash';

import * as Util from './util';
import * as Decklist from './decklist';

// Firestore client - as a Cloud Function, this is
// all the setup we need
const firestore = new Firestore.Firestore({
    projectId: process.env.GCP_PROJECT,
    timestampsInSnapshots: true
  });

/**
 * Enumerates the possible play states of a player.
 */
export enum PlayState {
    PLAYING = 'playing',
    DRAW = 'draw',
    LOST = 'lost',
    WON = 'won'
};

/**
 * Enumerates the Zones of a game.
 */
export enum Zone {
    LIBRARY = 'Library',
    HAND = 'Hand',
    BATTLEFIELD = 'Battlefield',
    GRAVEYARD = 'Graveyard',
    STACK = 'Stack',
    EXILE = 'Exile',
    COMMAND = 'Command'
    // Reveal zone maybe?
};

/**
 * The player document.
 */
export interface PlayerDocument {
    // The life total for the player
    life: number,
    // The player's username
    username: string,
    counters: {
        // How many energy counters the player has
        energy: number,
        // How many experience counters the player has
        experience: number,
        // How many poison counters the player has
        poison: number
    },
    // The state of the player
    play_state: PlayState,
    meta: {
        // The deckID being used, this can be used as a parameter to
        // the populateDeckFunction
        deckId: string
    }
}

/**
 * Create the base player document.
 * 
 * @param player The username of the player
 */
const createBasePlayerDocument = function(player: string, deckId: string): PlayerDocument {
    return {
        life: 40,
        username: player,
        counters: {
            energy: 0,
            experience: 0,
            poison: 0
        },
        play_state: PlayState.PLAYING,
        meta: {
            deckId: deckId
        }
    };
};

export interface ZoneDocument {
    cards: any
}

/**
 * Create an empty zone.
 */
const createEmptyZone = function(): ZoneDocument {
    // TODO I would like to define a type for this, but not sure how since
    // {} is not a Map
    return {
        cards: {}
    };
};

/**
 * Create the library zone.
 * 
 * @param player The username of the player
 * @param deck The entirety of the deck
 */
const createLibraryZone = function(player: string, deck: Decklist.Deck): ZoneDocument {
    const zone = createEmptyZone();

    // Expand the deck so a card with quantity > 1 becomes
    // that number of distinct objects
    const library = [];
    _.forEach(deck.cards, (card: Decklist.IdentifiedCard) => {
        for (let i = 0; i < card.qty; i++) {
            library.push(card);
        }
    });
    // Now shuffle it
    library.sort(() => uuidv4());

    // Now we can iterate over the library to create the zone
    let position = 0;
    _.forEach(library, (card: Decklist.IdentifiedCard) => {
        if (card.board === Decklist.Board.MAIN) {
            const id = uuidv4();
            // We do not fully populate this since it is unnecessary,
            // and this reduces bandwidth usage (recall that we pay for 
            // bandwith and since Firestore is schemaless, the field name 
            // has to be sent as well)
            // TODO: this creates an invalid object... probably because the properties
            // aren't properly defined
            Object.defineProperty(zone.cards, id, {
                value: {
                    id: id,
                    scryfall_id: card.id,
                    state: {
                        owner: player,
                        controller: player,
                        zone: Zone.LIBRARY,
                        position: position,
                        tapped: false,
                        face_up: false,
                        clone_of: null,
                        is_morph: false,
                        is_token: false,
                        power: null,
                        toughness: null,
                        attachments: {
                            counters: {

                            },
                            permanents: {

                            }
                        }
                    }
                },
                enumerable: true
            });
            position++;
        }
    });
    
    return zone;
};

/**
 * Create the command zone.
 * 
 * @param player The username of the player
 * @param deck The entirety of the deck
 */
const createCommandZone = function(player: string, deck: Decklist.Deck): ZoneDocument {
    const zone = createEmptyZone();

    _.forEach(deck.cards, (card: Decklist.IdentifiedCard) => {
        if (card.board === Decklist.Board.COMMAND) {
            const id = uuidv4();
            Object.defineProperty(zone.cards, id, {
                value: {
                    id: id,
                    scryfall_id: card.id,
                    state: {
                        owner: player,
                        controller: player,
                        zone: Zone.COMMAND,
                        position: 0,
                        tapped: false,
                        face_up: true,
                        clone_of: null,
                        is_morph: false,
                        is_token: false,
                        power: null,
                        toughness: null,
                        attachments: {
                            counters: {

                            },
                            permanents: {

                            }
                        }
                    }
                },
                enumerable: true
            });
        }
    });
    return zone;
}

/**
 * This is a hacky workaround to a problem with how some objects are generated,
 * causing the Firestore SDK to fail to read any fields.
 * 
 * @param obj The object to regenerate
 */
const regenerateObject = function(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Create the player document, initializing all fields, as well as all Zones.
 * 
 * @param gameRef A DocumentReference to the game
 * @param player The username of the player
 * @param deck The player's deck
 */
const createPlayerInFirestore = async function(gameRef: Firestore.DocumentReference, player: string,
    deck: any, deckId: string): Promise<void> {
        const basePlayerDoc = createBasePlayerDocument(player, deckId);
        try {
            await gameRef.collection('Players').doc(player).create(basePlayerDoc);
        } catch (e) {
            if (e.message.includes('ALREADY_EXISTS')) {
                throw createError(409, null, {
                    headers: {
                        'X-Reason': 'The target player is already in the game'
                    }
                });
            } else {
                console.error('Caught unrecognized error creating player document', e);
                throw createError(500);
            }
        }

        const playerRef = gameRef.collection('Players').doc(player);
        const libraryZone = regenerateObject(createLibraryZone(player, deck));
        const commandZone = regenerateObject(createCommandZone(player, deck));

        try {
            await Promise.all([
                playerRef.collection('Zones').doc(Zone.LIBRARY).create(libraryZone),
                playerRef.collection('Zones').doc(Zone.COMMAND).create(commandZone),
                playerRef.collection('Zones').doc(Zone.HAND).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.BATTLEFIELD).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.GRAVEYARD).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.EXILE).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.STACK).create(createEmptyZone()),
            ]);
        } catch (e) {
            console.error('Caught error initializing zones', e)
            throw createError(500);
        }
    }

/**
 * Host a game by creating a new game document and adding the player and her
 * deck to the game.
 * 
 * @param player The username of the player
 * @param deckId The deck document ID
 */
const hostGameHelper = async function(player: string, deckId: string): Promise<string> {
    const deckDoc = await Util.getDeck(player, deckId);
    const deck = deckDoc.data();
    const baseGameDoc = {};
    try {
        const gameDocRef = await firestore.collection('Games').add(baseGameDoc);
        console.info('Created new game at: ' + gameDocRef.path);
        try {
            await createPlayerInFirestore(gameDocRef, player, deck, deckId);
            return Promise.resolve(gameDocRef.id);
        } catch (e) {
            if (e instanceof createError.HttpError) {
                throw e;
            } else {
                console.error('Caught error creating player in Firestore', e)
                throw createError(500);
            }
        }
    } catch (e) {
        console.error('Caught error adding base game document', e)
        throw createError(500);
    }
}

/**
 * Join a game by adding the player and her deck to the game.
 * 
 * @param gameId The game document ID
 * @param player The username of the player
 * @param deckId The deck document ID
 */
const joinGameHelper = async function(gameId: string, player: string, deckId: string): Promise<void> {
    const deckDoc = await Util.getDeck(player, deckId);
    const deck = deckDoc.data();
    const gameDocRef = firestore.collection('Games').doc(gameId);
    let gameDoc;
    try {
        gameDoc = await gameDocRef.get();
    } catch (e) {
        console.error('Caught error getting game document', e)
        throw createError(500);
    }
    if (!gameDoc.exists) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'The target game does not exist'
            }
        });
    }
    
    return createPlayerInFirestore(gameDocRef, player, deck, deckId);
}

/**
 * Start the game by determining the turn order.
 * 
 * @param gameId The game document ID
 */
const startGameHelper = async function(gameId: string): Promise<void> {
    try {
        const gameDocRef = firestore.collection('Games').doc(gameId);
        const gameDoc = await gameDocRef.get();
        if (gameDoc.exists) {
            const playersCol = await gameDocRef.collection('Players').get();
            const playerOrder = playersCol.docs
                .map((doc) => doc.id)
                .sort(() => uuidv4());
            
            await gameDocRef.set({ turn_order: { ...playerOrder } }, { merge: true })
            return;
        } else {
            throw createError(400, 'Bad Request', {
                headers: {
                    'X-Reason': 'The game document does not exist' 
                }
            });
        }
    } catch (e) {
        if (e instanceof createError.HttpError) {
            throw e;
        } else {
            console.error('Caught error determining turn order', e);
            throw createError(500);
        }
        
    }
}

/**
 * This Function creates a new game with the player and her deck.
 */
export const hostGameFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response
            .status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }
    
    const { player, deckId } = request.body;

    if (!player) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting host player\'s username');
        return;
    }
    if (!deckId) {
        response
            .status(400)
            .send('Body must include "deckId" attribute denoting host player\'s desired deck ID');
        return;
    }

    console.log('Creating new game with hosting player ' + player);
    console.log('Using deck with ID ' + deckId);

    hostGameHelper(player, deckId)
        .then((gameDocId) => {
            response.status(201)
                .header('X-GameID', gameDocId)
                .send();
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        })
});

/**
 * This Function adds a player to an existing game.
 */
export const joinGameFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }
    
    const { gameId, player, deckId } = request.body;

    if (!gameId) {
        response
            .status(400)
            .send('Body must include "gameId" attribute denoting target game\'s ID');
        return;
    }
    if (!player) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting host player\'s username');
        return;
    }
    if (!deckId) {
        response
            .status(400)
            .send('Body must include "deckId" attribute denoting host player\'s desired deck ID');
        return;
    }

    console.log('Joining existing game (' + gameId + ') with hosting player ' + player);
    console.log('Using deck with ID ' + deckId);

    joinGameHelper(gameId, player, deckId)
        .then(() => {
            response.status(200)
                .send();
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        })
});

/**
 * This Function starts the game. This means it determines the turn order for all players
 * in the game. It is legal to start a single game multiple times (each time, recalculating
 * the turn order).
 */
export const startGameFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }
    
    const { gameId } = request.body;

    if (!gameId) {
        response
            .status(400)
            .send('Body must include "gameId" attribute denoting target game\'s ID');
        return;
    }

    startGameHelper(gameId)
        .then(() => {
            response.send('Game is ready to start.');
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        })
});