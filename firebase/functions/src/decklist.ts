import * as functions from 'firebase-functions';
import * as createError from 'http-errors';
import * as _ from 'lodash';
import axios from 'axios';

import * as scryfall from './scryfall';
import * as Util from './util';
import { URL } from 'url';

// TODO not sure how to correctly convert this to an import
const url = require('url');

// We may wish to have a single method both parses the deck and 
// populates the scryfall information for the deck editor in the
// future. At that time, we may extend this to include a populate
// boolean parameter
export interface DecklistParseRequest {
    /**
     * The URI of the decklist, e.g. https://www.mtggoldfish.com/deck/1326092
     */
    uri: string
}

/**
 * Enumerates the boards of a decklist.
 */
export enum Board {
    // These cards go in your library
    MAIN = 'main',
    // These cards go in your command zone
    COMMAND = 'command',
    // These cards could go in your library
    SIDE = 'side',
    // These cards could be exchanged with cards in your Main board for Commander
    MAYBE = 'maybe'
};

/**
 * A NamedCard is parsed from a decklist, and contains no Scryfall data.
 */
export interface NamedCard {
    // The name of the card, e.g. Mountain
    name: string,
    // The quantity of the card
    qty: number,
    // The set of the card, which is optional
    set?: string,
    // The board to which this card belongs
    board: Board
}

/**
 * This is the same interface as the Deck document schema.
 */
export interface Deck {
    // The name of the deck
    name: string,
    // The cards in the deck, where the key is the Scryfall ID
    cards: any,
    // Optional information about the imported deck
    import_info?: {
        // The URI from which the deck was imported
        uri: string
    },
    // Optional game types for which this deck is valid
    game_types?: Array<string>
}

/**
 * This is the same interface as 'DeckCardMap' in the schema.
 */
export interface IdentifiedCard {
    // The Scryfall ID of the card
    id: string,
    // The quantity of the card
    qty: number,
    // The set to which this card belongs
    set: string,
    // The board to which this card belongs
    board: Board
}

/**
 * This is the intermediate format of all parsed decks, be it parsed
 * from a site like MTGGoldfish, or from plain text.
 */
export interface ParsedDeck {
    // The cards parsed from the deck list
    cards: Array<NamedCard>,
    // The name of the deck
    name?: string,
    // Optional game types for which this deck is valid
    game_types?: Array<string>
}

/**
 * A deck that has been populated with Scryfall data
 */
export interface PopulatedDeck {
    // type is any since the included fields are customizable
    cards: Array<any>,
}

/**
 * Parse a deck from MTGGoldfish.
 * 
 * @param deckId The ID of the deck
 */
const parseDeckFromMTGGoldfish = async function(deckId: string): Promise<ParsedDeck> {
    console.info('Parsing deck from MTGGoldfish with ID: ', deckId);
    let response;
    try {
        response = await axios({
            url: "https://wrapapi.com/use/eeeeeric/mtg/mtg-goldfish/0.0.5",
            method: 'post',
            data: {
              "deckId": deckId,
              "wrapAPIKey": functions.config().wrapapi.key
            }
        });
    } catch (e) {
        console.error('Failed to call WrapAPI: ', e);
        throw createError(500);
    }

    if (!response.data.success) {
        console.error('WrapAPI failed to parse deck', response);
        throw createError(500);
    }

    const wrapAPIData = response.data.data;
    const deckTitle: string = wrapAPIData.title;
    const parsedDeck: Array<NamedCard> = wrapAPIData.deck.map(card => {
        let board: Board = Board.MAIN;
        if (wrapAPIData.commander === card.name ||
            wrapAPIData.commander_partner === card.name) {
            board = Board.COMMAND;
        }

        return {
            name: card.name,
            qty: card.qty,
            board: board
        };
    })

    console.info('Parsed deck: ', parsedDeck);

    return {
        name: deckTitle,
        cards: parsedDeck
    };
}

/**
 * Parse a deck from a deck list provider.
 * 
 * @param params The parameters for parsing the deck list
 */
const parseDeck = async function(params: DecklistParseRequest): Promise<ParsedDeck> {
    const uri: URL = url.parse(params.uri);
    if (uri.host.toLowerCase().endsWith('mtggoldfish.com')) {
        const deckId = uri.pathname.substring(uri.pathname.lastIndexOf('/') + 1);
        return await parseDeckFromMTGGoldfish(deckId);
    } else {
        throw createError(400, 'Bad Request', {
            headers: {
                'X-Reason': 'The provided deck list URI is unsupported',
                'X-Allowed-Deck-Lists': 'MTGGoldfish' 
            }
        });
    }
}

/**
 * Populate a deck with Scryfall data.
 * 
 * @param deck The ParsedDeck to populate with Scryfall data
 * @param include The fields to include from the Scryfall data. If not provided,
 * then no filtering will be performed.
 */
const populateDeck = async function(deck: ParsedDeck, ...include: string[]) {
    const cards: Array<any> = await Promise.all(
        deck.cards.map(async (card) => {
            const data = await scryfall.getCardData({
                exact: card.name,
                ...card.set && { set: card.set }
            });
            data.qty = card.qty;
            data.board = card.board;
            if (include.length === 0) {
                // If nothing is provided, then don't filter
                return data;
            } else {
                return _.pick(data, include);
            }
        })
    );
    return {
        name: deck.name,
        cards: cards,
        game_types: deck.game_types
    };
}

/**
 * Populate a deck that exists within Firestore with Scryfall data.
 * 
 * @param username The username of the user that owns the deck
 * @param deckId The id of the deck to populate
 * @param include The fields to include from the Scryfall data. If not provided,
 * then no filtering will be performed.
 */
const populateDeckForUser = async function(username: string, deckId: string, ...include: string[]) {
    const deck = await Util.getDeck(username, deckId);
    const cards: Array<any> = await Promise.all(
        // Note that Object#values is not available in our execution environment (NodeJS 6)
        Object.keys(deck.data().cards)
            .map(key => deck.data().cards[key])
            .map(async (card) => {
                const data = await scryfall.getCardDataForID(card.id);
                data.qty = card.qty;
                data.board = card.board;
                if (include.length === 0) {
                    // If nothing is provided, then don't filter
                    return data;
                } else {
                    return _.pick(data, include);
                }
            })
    );
    return {
        cards: cards
    };
}

/**
 * Convenience method that parses a deck and then populates it. The primary
 * use case for this method is for transforming NamedCards to IdentifiedCards.
 * 
 * @param params The parameters for parsing the deck
 * @param include The properties that should be included in the card objects
 */
const parseDeckAndPopulate = async function(params: DecklistParseRequest, ...include: string[]) {
    const parsedDeck = await parseDeck(params);
    return await populateDeck(parsedDeck, ...include);
}

/**
 * Import a deck for a user.
 * 
 * @param username The username of the user
 * @param request The DecklistParseRequest
 * @returns The ID of the Deck document
 */
const importDeck = async function(username: string, request: DecklistParseRequest): Promise<string> {
    const user = await Util.getUser(username);
    const populatedDeck = await parseDeckAndPopulate(request, 
        'id', 'qty', 'board', 'set');
    const cards = _.keyBy(populatedDeck.cards, 'id');
    const deck = {
        name: populatedDeck.name,
        cards: cards
    };
    try {
        const deckRef = await user.ref.collection('Decks').add(deck);
        return deckRef.id;
    } catch (e) {
        console.error('Caught error writing deck', e);
        throw createError(500);
    }
}

/**
 * This Function parses a deck list from a deck list provider such as MTGGoldfish.
 */
export const parseDeckFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }

    const uri = request.body.uri;

    if (!uri) {
        response
            .status(400)
            .send('Body must include "uri" attribute targeting deck to import');
        return;
    }

    parseDeck({ uri: uri })
        .then((deck) => {
            response.send(deck);
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        });
});

/**
 * This Function provides batch scryfall data for a deck.
 */
export const populateDeckFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }

    const { player, deckId } = request.body;
    let { include } = request.body;

    if (!player) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting import target user\'s name');
        return;
    }
    if (!deckId) {
        response
            .status(400)
            .send('Body must include "deckId" attribute denoting deck to populate');
        return;
    }
    if (!include) {
        // If not provided, don't filter
        include = [];
    }

    populateDeckForUser(player, deckId, ...include)
        .then((deck) => {
            response.send(deck);
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        });
});

/**
 * This is a convenience Function that imports a deck for a user directly
 * from a decklist URI.
 * 
 * This Function has the drawback of not allowing the user to make any sort
 * of edits to the deck prior to import, but for our MVP, this does the job.
 */
export const importDeckFunction = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
        return;
    }
    
    const { player, uri } = request.body;

    if (!player) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting import target user\'s name');
        return;
    }
    if (!uri) {
        response
            .status(400)
            .send('Body must include "uri" attribute denoting deck to parse');
        return;
    }

    importDeck(player, { uri: uri })
        .then((id) => {
            response
                .header('X-DeckID', id)
                .send('Deck imported.');
        })
        .catch((error) => {
            Util.errorResponseMapper(error, response);
        });
});