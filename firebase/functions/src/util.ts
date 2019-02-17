import * as Firestore from '@google-cloud/firestore';
import * as express from 'express';

import * as Response from './response';

const firestore = new Firestore.Firestore({
    projectId: process.env.GCP_PROJECT,
    timestampsInSnapshots: true
});

/**
 * Get the DocumentSnapshot for the user with the given username.
 * 
 * @param uid The uid of the user to get
 */
export const getUser = async function(uid: string): Promise<Firestore.DocumentSnapshot> {
    return await firestore.doc(`Users/${uid}`).get();
}

/**
 * Get the DocumentSnapshot for the deck belonging to the user.
 * 
 * @param username The username of the user that owns the deck
 * @param deckId The ID of the deck to retrieve
 * 
 * @throws HttpError.BadRequest if the deck does not exist
 */
export const getDeck = async function(username: string, deckId: string): Promise<Firestore.DocumentSnapshot> {
    const userDoc = await getUser(username);
    const deckDoc = await userDoc.ref.collection('Decks').doc(deckId).get();

    if (!deckDoc.exists) {
        throw new Response.FunctionError(
            Response.Messages.DECK_DOES_NOT_EXIST,
            Response.Errors.DECK_DOES_NOT_EXIST, 
            400);
    }
    return deckDoc;
}

/**
 * Writes a response based on the provided FunctionError.
 * 
 * @param error The error
 * @param response The writable response object
 */
export const errorResponseMapper = function(error: Response.FunctionError, response: express.Response): void {
    response.status(error.statusCode)
        .send(error.toErrorResponse());
}