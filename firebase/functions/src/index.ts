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
// We currently do not check to make sure we don't infinite loop when updating 
// the Game document, so this is disabled
// export const lastModifiedGameDocumentFunction = Game.lastModifiedGameDocumentFunction;
export const lastModifiedPlayerDocumentFunction = Game.lastModifiedPlayerDocumentFunction;
// We could disable this as it will cause a high volume of function invocations,
// while for our needs, it should be sufficient to just track writes to the
// player document
export const lastModifiedCardDocumentFunction = Game.lastModifiedCardDocumentFunction;

// User Functions
export const createUserDocumentFunction = User.createUserDocument;
export const deleteUserDocumentFunction = User.deleteUserDocument;
export const updateUserDocumentWithDeckFunction = User.updateUserDocumentWithDeck;
