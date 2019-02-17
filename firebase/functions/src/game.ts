import * as Firestore from '@google-cloud/firestore';
import * as functions from 'firebase-functions';
const uuidv4 = require('uuid/v4');
import * as _ from 'lodash';

import * as Util from './util';
import * as Decklist from './decklist';
import * as Response from './response';

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
    // The player's uid
    uid: string,
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
 * @param player The uid of the player
 */
const createBasePlayerDocument = function(player: string, deckId: string): PlayerDocument {
    return {
        life: 40,
        username: player,
        uid: player,
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

export interface Card {
    id: string,
    scryfall_id: string,
    state: {
        owner: string,
        controller: string,
        zone: Zone,
        position: number,
        tapped: boolean,
        face_up: boolean,
        clone_of: string,
        is_morph: boolean,
        is_token: boolean,
        power: number,
        toughness: number,
        attachments: {
            counters: {
                [key: string]: number,
            },
            permanents: {
                [key: string]: Card,
            }
        },
    }
}

/**
 * Create an array of Cards that can each be written as a document to Firestore.
 * 
 * @param player The uid of the player
 * @param deck The deck to process
 */
const createCards = function(player: string, deck: Decklist.Deck): Array<Card> {
    let library: Array<Decklist.IdentifiedCard> = _.filter(deck.cards, (card: Decklist.IdentifiedCard) => {
        return card.board === Decklist.Board.MAIN;
    });
    // expand cards with qty > 1
    library = _.flatMap(library, (card: Decklist.IdentifiedCard) => {
        if (card.qty > 1) {
            const expandedCards = [];
            for (let count = 0; count < card.qty; count++) {
                expandedCards.push(card);
            }
            return expandedCards;
        } else {
            return [card];
        }
    }).sort(() => uuidv4()); // shuffle

    const commandZone: Array<Decklist.IdentifiedCard> = _.filter(deck.cards, (card: Decklist.IdentifiedCard) => {
        return card.board === Decklist.Board.COMMAND;
    });

    const cards: Array<Card> = _.map(commandZone, (card: Decklist.IdentifiedCard) => {
        const firestoreCard: Card = {
            id: uuidv4(),
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
        };
        return firestoreCard;
    });

    cards.push(..._.map(library, (card: Decklist.IdentifiedCard, position: number) => {
        const firestoreCard: Card = {
            id: uuidv4(),
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
        };
        return firestoreCard;
    }));

    return cards;
}

/**
 * Create the player document, initializing all fields, as well as all Zones.
 * 
 * @param gameRef A DocumentReference to the game
 * @param uid The uid of the player
 * @param deck The player's deck
 */
const createPlayerInFirestore = async function(gameRef: Firestore.DocumentReference, uid: string,
    deck: any, deckId: string): Promise<void> {
        const basePlayerDoc = createBasePlayerDocument(uid, deckId);
        try {
            await gameRef.collection('Players').doc(uid).create(basePlayerDoc);
        } catch (e) {
            if (e.message.includes('ALREADY_EXISTS')) {
                throw new Response.FunctionError(
                    Response.Messages.TARGET_PLAYER_EXISTS_IN_GAME,
                    Response.Errors.TARGET_PLAYER_EXISTS_IN_GAME,
                    409,
                );
            } else {
                console.error('Caught unrecognized error creating player document', e);
                throw new Response.FunctionError(
                    Response.Messages.FIREBASE_ERROR,
                    Response.Errors.FIREBASE_ERROR,
                );
            }
        }

        const cardsRef = gameRef.collection('Cards');
        const cards: Array<Card> = createCards(uid, deck);

        try {
            await Promise.all(_.map(cards, (card: Card) => {
                return cardsRef.doc(card.id).create(card);
            }));
        } catch (e) {
            console.error('Caught error initializing cards', e)
            throw new Response.FunctionError(
                Response.Messages.FIREBASE_ERROR,
                Response.Errors.FIREBASE_ERROR,
            );
        }
    }

/**
 * Host a game by creating a new game document and adding the player and her
 * deck to the game.
 * 
 * @param uid The uid of the player
 * @param deckId The deck document ID
 */
const hostGameHelper = async function(uid: string, deckId: string): Promise<string> {
    const deckDoc = await Util.getDeck(uid, deckId);
    const deck = deckDoc.data();
    const baseGameDoc = {};
    try {
        const gameDocRef = await firestore.collection('Games').add(baseGameDoc);
        console.info('Created new game at: ' + gameDocRef.path);
        await createPlayerInFirestore(gameDocRef, uid, deck, deckId);
        return Promise.resolve(gameDocRef.id);
    } catch (e) {
        if (e instanceof Response.FunctionError) {
            throw e;
        } else {
            console.error('Caught error adding base game document', e)
            throw new Response.FunctionError(
                Response.Messages.FIREBASE_ERROR,
                Response.Errors.FIREBASE_ERROR,
            );
        }
    }
}

/**
 * Join a game by adding the player and her deck to the game.
 * 
 * @param gameId The game document ID
 * @param uid The uid of the player
 * @param deckId The deck document ID
 */
const joinGameHelper = async function(gameId: string, uid: string, deckId: string): Promise<void> {
    const deckDoc = await Util.getDeck(uid, deckId);
    const deck = deckDoc.data();
    const gameDocRef: Firestore.DocumentReference = firestore.collection('Games').doc(gameId);
    let gameDoc: Firestore.DocumentSnapshot;
    try {
        gameDoc = await gameDocRef.get();
    } catch (e) {
        console.error('Caught error getting game document', e)
        throw new Response.FunctionError(
            Response.Messages.FIREBASE_ERROR,
            Response.Errors.FIREBASE_ERROR,
        );
    }
    if (!gameDoc.exists) {
        throw new Response.FunctionError(
            Response.Messages.GAME_DOES_NOT_EXIST,
            Response.Errors.GAME_DOES_NOT_EXIST,
            400,
        );
    }
    
    return createPlayerInFirestore(gameDocRef, uid, deck, deckId);
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
            throw new Response.FunctionError(
                Response.Messages.GAME_DOES_NOT_EXIST,
                Response.Errors.GAME_DOES_NOT_EXIST,
                400,
            );
        }
    } catch (e) {
        if (e instanceof Response.FunctionError) {
            throw e;
        } else {
            console.error('Caught error determining turn order', e);
            throw new Response.FunctionError(
                Response.Messages.FIREBASE_ERROR,
                Response.Errors.FIREBASE_ERROR,
            );
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
    
    const { uid, deckId } = request.body;

    if (!uid) {
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'uid',
            description: 'The uid of the player that will host the game.'
        };
        response
            .status(400)
            .send(body);
        return;
    }
    if (!deckId) {
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'deckId',
            description: 'The id of the deck that the player will use.'
        };
        response
            .status(400)
            .send(body);
        return;
    }

    console.log('Creating new game with hosting player ' + uid);
    console.log('Using deck with ID ' + deckId);

    hostGameHelper(uid, deckId)
        .then((gameDocId) => {
            const body: Response.GameCreatedResponse = {
                message: Response.Messages.GAME_CREATED,
                gameId: gameDocId,
            };
            response
                .status(201)
                .send(body);
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
    
    const { gameId, uid, deckId } = request.body;

    if (!gameId) {
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'gameId',
            description: 'The id of the game to join.',
        };
        response
            .status(400)
            .send(body);
        return;
    }
    if (!uid) {
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'uid',
            description: 'The uid of the player that will join the game.',
        };
        response
            .status(400)
            .send(body);
        return;
    }
    if (!deckId) {
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'deckId',
            description: 'The id of the deck that the player will use.',
        };
        response
            .status(400)
            .send(body);
        return;
    }

    console.log('Joining existing game (' + gameId + ') as player ' + uid);
    console.log('Using deck with ID ' + deckId);

    joinGameHelper(gameId, uid, deckId)
        .then(() => {
            response.send(204);
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
        const body: Response.MissingRequiredParameterResponse = {
            message: Response.Messages.MISSING_REQUIRED_PARAMETER,
            error: Response.Errors.MISSING_REQUIRED_PARAMETER,
            parameter: 'gameId',
            description: 'The id of the game to join.',
        };
        response
            .status(400)
            .send(body);
        return;
    }

    startGameHelper(gameId)
        .then(() => {
            response.send(204);
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        })
});