import * as Firestore from '@google-cloud/firestore';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';

// Firestore client - as a Cloud Function, this is
// all the setup we need
const firestore = new Firestore.Firestore({
    projectId: process.env.GCP_PROJECT,
    timestampsInSnapshots: true
});

/**
 * This maps directly to the User document in Firestore.
 */
export interface UserDocument {
    // The uid of the user, as assigned by Firebase Auth
    uid: string,
    // The username of the user, e.g. the displayName
    username: string,
    // OPT. A photo of the user, e.g. the photoURL
    profile_picture?: string,
    // A summary of decks that the user has imported
    decks: {
        [deckId: string]: DeckInfo,
    },
}

/**
 * This maps directly to the DeckInfo map type in Firestore.
 */
export interface DeckInfo {
    id: string,
    name: string,
    picture?: string,
}

export const createUserDocument = functions.auth.user().onCreate(
    async (user: functions.auth.UserRecord, context: functions.EventContext) => {
        try {
            const userDoc: UserDocument = {
                uid: user.uid,
                username: user.displayName,
                profile_picture: user.photoURL,
                decks: {

                }
            };
            await firestore.doc(`Users/${user.uid}`).create(userDoc);
        } catch (e) {
            console.error(`Could not create user document for ${user.uid}`, e);
        }
});

export const deleteUserDocument = functions.auth.user().onDelete(
    async (user: functions.auth.UserRecord, context: functions.EventContext) => {
        try {
            await firestore.doc(`Users/${user.uid}`).delete();
        } catch (e) {
            console.error(`Could not delete user document for ${user.uid}`, e);
        }
});

/**
 * When a deck is created, add it the user's decks summary.
 * 
 * NOTE: We don't support deleting decks yet.
 */
export const updateUserDocumentWithDeck = functions.firestore
    .document('Users/{userId}/Decks/{deckId}').onCreate(
        async (snapshot: Firestore.DocumentSnapshot, context: functions.EventContext) => {
            const deck = snapshot.data();
            const deckInfo: DeckInfo = {
                id: snapshot.id,
                ... _.pick(deck, ['name']),
            };

            try {
                await firestore.doc(`Users/${context.params.userId}`).update({
                    [`decks.${snapshot.id}`]: deckInfo,
                });
            } catch (e) {
                console.error(`Could not update user document for ${context.params.userId}` + 
                    ` to include deck info for ${context.params.deckId}`, e);
            }
            
        });
