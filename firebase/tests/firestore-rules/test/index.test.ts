import 'mocha';
import { expect } from 'chai';
import * as _ from 'lodash';
// Standard Firebase client
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// Admin client (not subject to security rules)
import * as Firestore from '@google-cloud/firestore';

import { config, userInfo } from '../../firebase-config';

// Firestore client
const firestore = new Firestore.Firestore({
    projectId: 'mystic-the-get-together-test',
    // This file is NOT checked in to Git
    keyFilename: 'service-account-credentials.json',
  });

const test = {
    game: {
        path: '/Games/myGame',
    },
    players: {
        user1: {
            path: `/Games/myGame/Players/${userInfo.user1.uid}`,
        },
        user2: {
            path: `/Games/myGame/Players/${userInfo.user2.uid}`,
        },
    },
    card: {
        path: '/Games/myGame/Cards/myCard',
    },
}

describe('Firestore Security Rules Test Suite', function() {
    describe('Test Setup', function() {
        it('Setup test data', async function() {
            firebase.initializeApp(config);
    
            await Promise.all([
                firestore.doc(test.card.path).create({
                    state: {
                        owner: userInfo.user1.uid,
                        controller: userInfo.user2.uid,
                    },
                }),
                firestore.doc(test.players.user1.path).create({
                    uid: userInfo.user1.uid,
                }),
            ]);
        });
    });
    
    describe('Reads Require Authentication', function() {
        it('Only authenticated users can read data', async function() {
            try {
                await firebase.firestore().doc(test.card.path).get();
                expect(false).to.be.true;
            } catch (error) {
                expect(error.code).to.equal('permission-denied');
            }
        });
    });
    
    describe('Player Data', function() {
        it('Only a player can update her own data', async function() {
            try {
                await firebase.auth().signInWithEmailAndPassword(
                    userInfo.user1.email, userInfo.user1.password);
                await firebase.firestore().doc(test.players.user2.path).update({
                    life: 0,
                });
                expect(false).to.be.true;
            } catch (error) {
                expect(error.code).to.equal('permission-denied');
            }
    
            // This should succeed without issue
            await firebase.firestore().doc(test.players.user1.path).update({
                life: 0,
            });
        });
    });
    
    describe('Only players in a game can create additional cards', function() {
        it('Players outside of the game cannot create additional cards', async function() {
            // user2 does not have a player document so for the purpose of this test
            // she is not in the game
            const cardPath = `${test.game.path}/Cards/invalidCard`;
            try {
                await firebase.auth().signInWithEmailAndPassword(
                    userInfo.user2.email, userInfo.user2.password);
                await firebase.firestore().doc(cardPath).set({
                    state: {
                        zone: 'Battlefield',
                    },
                });
                expect(false).to.be.true;
            } catch (error) {
                expect(error.code).to.equal('permission-denied');
            } finally {
                await Promise.all([
                    firestore.doc(cardPath).delete(),
                    firebase.auth().signOut()
                ]);
            }
        });

        it('Players inside the game can create cards, but only on the battlefield', async function() {
            const libraryCard = `${test.game.path}/Cards/libraryCard`;
            const battlefieldCard = `${test.game.path}/Cards/battlefieldCard`
            try {
                try {
                    await firebase.auth().signInWithEmailAndPassword(
                        userInfo.user1.email, userInfo.user1.password);
                    const libraryCardRef = firebase.firestore().doc(libraryCard);
                    const libraryCardSnapshot = await libraryCardRef.get();
                    expect(libraryCardSnapshot.exists).to.be.false;
                    await libraryCardRef.set({
                        state: {
                            zone: 'Library',
                        },
                    });
                    expect(false).to.be.true;
                } catch (error) {
                    expect(error.code).to.equal('permission-denied');
                }

                const battlefieldCardRef = firebase.firestore().doc(battlefieldCard);
                const battlefieldCardSnapshot = await battlefieldCardRef.get();
                expect(battlefieldCardSnapshot.exists).to.be.false;
                await battlefieldCardRef.set({
                    state: {
                        zone: 'Battlefield',
                    },
                });
            } finally {
                await Promise.all([
                    firebase.auth().signOut(),
                    firestore.doc(libraryCard).delete(),
                    firestore.doc(battlefieldCard).delete(),
                ]);
            }
        });
    });

    describe('Card Updates', function() {
        it(`Only the card's controller may update the document`, async function() {
            // Recall the card is controlled by user2
            try {
                await firebase.auth().signInWithEmailAndPassword(
                    userInfo.user2.email, userInfo.user2.password);
                await firebase.firestore().doc(test.card.path)
                    .update({
                        'state.tapped': true,
                    });
            } finally {
                await firebase.auth().signOut();
            }
            try {
                await firebase.auth().signInWithEmailAndPassword(
                    userInfo.user1.email, userInfo.user1.password);
                await firebase.firestore().doc(test.card.path)
                    .update({
                        'state.tapped': false,
                    });
                expect(false).to.be.true;
            } catch (error) {
                expect(error.code).to.equal('permission-denied');
            } finally {
                await firebase.auth().signOut();
            }
        });
    });
    
    describe('Test Teardown', function() {
        it('Delete created documents', async function() {
            await Promise.all([
                firestore.doc(test.card.path).delete(),
                firestore.doc(test.game.path).delete(),
                firestore.doc(test.players.user1.path).delete(),
            ]);
        });
    });
});