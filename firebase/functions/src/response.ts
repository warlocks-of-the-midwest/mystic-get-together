export interface BaseResponse {
    // A human-readable message
    message: string,
}

export interface GameCreatedResponse extends BaseResponse {
    // The game ID
    gameId: string,
}

export interface DeckImportedResponse extends BaseResponse {
    // The deck ID
    deckId: string,
}

export enum Messages {
    GAME_CREATED = 'The game has been created and can now be joined.',
    DECK_IMPORTED = 'The deck has been imported.',
    MISSING_REQUIRED_PARAMETER = 'A required parameter is missing in the body of the request.',
    DECK_DOES_NOT_EXIST = 'The target deck does not exist for the target player.',
    WRAP_API_CALL_FAILURE = 'The call to WrapAPI failed.',
    WRAP_API_PARSE_FAILURE = 'WrapAPI failed to parse the decklist.',
    UNSUPPORTED_DECKLIST_PROVIDER = 'Only MTGGoldfish is supported.',
    FIREBASE_ERROR = 'An error occurred when interacting with Firebase.',
    TARGET_PLAYER_EXISTS_IN_GAME = 'The target player is already in the game.',
    GAME_DOES_NOT_EXIST = 'The target game does not exist.',
    SCRYFALL_ERROR = 'An error has occurred communicating with Scryfall.',
}

export enum Errors {
    MISSING_REQUIRED_PARAMETER = 'Missing Required Parameter',
    DECK_DOES_NOT_EXIST = 'Deck Does Not Exist',
    WRAP_API_ERROR = 'WrapAPI Error',
    UNSUPPORTED_DECKLIST_PROVIDER = 'Unsupported Decklist Provider',
    FIREBASE_ERROR = 'Firebase Error',
    TARGET_PLAYER_EXISTS_IN_GAME = 'Duplicate Player In Game',
    GAME_DOES_NOT_EXIST = 'Games Does Not Exist',
    SCRYFALL_ERROR = 'Scryfall Error',
}

export interface ErrorResponse extends BaseResponse {
    error: Errors,
}

export interface MissingRequiredParameterResponse extends ErrorResponse {
    // The parameter that is missing
    parameter: string,
    // A description of the parameter
    description: string,
}

export class FunctionError extends Error {
    error: Errors;
    statusCode: number;

    constructor(message: string, error: Errors, statusCode?: number) {
        super(message); // 'Error' breaks prototype chain here
        this.error = error;
        this.statusCode = statusCode || 500;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    toErrorResponse() : ErrorResponse {
        const response: ErrorResponse = {
            message: this.message,
            error: this.error,
        };
        return response;
    }
}
