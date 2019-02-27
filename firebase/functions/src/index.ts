import * as Decklist from './decklist';
import * as Game from './game';
import * as User from './user';

// Deck Functions
export const importDeckFunction = Decklist.importDeckFunction;
export const parseDeckFunction = Decklist.parseDeckFunction;
export const populateDeckFunction = Decklist.populateDeckFunction;

// Game Functions
export const hostGameFunction = Game.hostGameFunction;
export const joinGameFunction = Game.joinGameFunction;
export const startGameFunction = Game.startGameFunction;

// User Functions
export const createUserDocumentFunction = User.createUserDocument;
export const deleteUserDocumentFunction = User.deleteUserDocument;
export const updateUserDocumentWithDeckFunction = User.updateUserDocumentWithDeck;
