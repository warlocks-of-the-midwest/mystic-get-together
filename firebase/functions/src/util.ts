import * as Firestore from '@google-cloud/firestore';
import * as express from 'express';
import * as createError from 'http-errors';

const firestore = new Firestore.Firestore({
    projectId: process.env.GCP_PROJECT,
    timestampsInSnapshots: true
});

/**
 * Get the DocumentSnapshot for the user with the given username.
 * 
 * @param username The username of the user to get
 */
export const getUser = async function(username: string): Promise<Firestore.DocumentSnapshot> {
    let querySnapshot: Firestore.QuerySnapshot;
    try {
        querySnapshot = await firestore.collection('Users')
            .where('username', '==', username)
            .limit(1)
            .get();
    } catch (e) {
        console.error('Caught error searching for user', e);
        throw createError(500);
    }
    
    if (querySnapshot.docs.length === 0) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'User does not exist'
            }
        });
    }

    const userSnapshot = querySnapshot.docs[0];
    return userSnapshot;
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
    let deckDoc;
    try {
        deckDoc = await userDoc.ref.collection('Decks').doc(deckId).get();
    } catch (e) {
        console.error('An error occured reading from Firestore', e);
        throw createError(500);
    }

    if (!deckDoc.exists) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'The deck does not exist'
            }
        });
    }
    return deckDoc;
}

/**
 * Writes a response based on the provided HttpError.
 * 
 * @param error The HttpError
 * @param response The writable response object
 */
export const errorResponseMapper = function(error: createError.HttpError, response: express.Response): void {
    response.status(error.status)
        .header(error.headers)
        .send(error.message);
}