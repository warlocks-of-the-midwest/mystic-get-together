import 'mocha';
import { expect } from 'chai';
import * as _ from 'lodash';
import * as supertest from 'supertest';
import * as Firestore from '@google-cloud/firestore';
import * as admin from 'firebase-admin';

import * as Decklist from '../src/decklist';
import * as Game from '../src/game';

import * as TestUtils from './test-utils';
import { GameStatus } from '../src/game';

// Firestore client
const firestore = new Firestore.Firestore({
  projectId: 'mystic-the-get-together-test',
  // This file is NOT checked in to Git
  keyFilename: 'service-account-credentials.json',
  timestampsInSnapshots: true
});

// Admin SDK
const app: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert('service-account-credentials.json'),
  databaseURL: 'https://mystic-the-get-together-test.firebaseio.com'
});

const functionsConfig = {
    baseURI: 'https://us-central1-mystic-the-get-together-test.cloudfunctions.net',
    user1: {
        uid: 'JLI7eua7cnRYBYGdWbepVqZwQEg1',
        deckURI: 'https://www.mtggoldfish.com/deck/1572154',
    },
    user2: {
        uid: 'cKDlZPoerrVy3NbgR1a7HJmeW3E2',
        deckURI: 'https://www.mtggoldfish.com/deck/1511674',
    }
}

describe('Cloud Functions Test Suite', function() {

  const createdUserUID: string = 'create-user-test';
  const createdUserName: string = 'Nicol Bolas';

  describe('Tests for createUserDocumentFunction', function() {
    describe('Test that the user document is created when a user is created', function() {
      it('Create the user', async function() {
        const request: admin.auth.CreateRequest = {
          uid: createdUserUID,
          displayName: createdUserName,
        };
        const userRecord: admin.auth.UserRecord = await admin.auth().createUser(request);
        expect(userRecord.uid).to.equal(createdUserUID);
      });

      it(`The "Users/${createdUserUID}" document should exist and have uid and username populated`, async function() {
        this.timeout(30000);
        const userDoc: Firestore.DocumentReference = await firestore.doc(`Users/${createdUserUID}`);
        const userDocExists: boolean = await TestUtils.attempt(async () => {
          const snapshot = await userDoc.get();
          if (!snapshot.exists) {
            return Promise.reject(new Error('Snapshot should exist'));
          }
          return snapshot.exists;
        });
        expect(userDocExists).to.be.true;

        const snapshot = await userDoc.get();
        expect(snapshot.data().uid).to.equal(createdUserUID);
        expect(snapshot.data().username).to.equal(createdUserName);
      });
    });
  });

  describe('Tests for deleteUserDocumentFunction', function() {
    describe('Test that the user document is deleted when a user is deleted', function() {
      it('Delete the user', async function() {
        await admin.auth().deleteUser(createdUserUID);
      });

      it(`The "Users/${createdUserUID}" document should not exist`, async function() {
        this.timeout(30000);
        const userDoc: Firestore.DocumentReference = await firestore.doc(`Users/${createdUserUID}`);
        const userDocExists: boolean = await TestUtils.attempt(async () => {
          const snapshot = await userDoc.get();
          if (snapshot.exists) {
            return Promise.reject(new Error('Snapshot should not exist'));
          }
          return snapshot.exists;
        });
        expect(userDocExists).to.be.false;
      });
    });
  });

  // Tests for importDeckFunction
  let user1DeckId: string;
  let user2DeckId: string;

  describe('Tests for importDeckFunction', function() {
    describe('Test importing a standard commander deck (1 commander, 99 other)', function() {
      describe('Import a standard commander deck for user1, via Cloud Function', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
              uid: functionsConfig.user1.uid,
              uri: functionsConfig.user1.deckURI,
          })
          .expect(201)
          .then(function (res) {
            user1DeckId = res.body.deckId;
          });
        });
      });
  
      describe('Validate the document in Firestore', function() {
        let deckDoc: Firestore.DocumentSnapshot;
        it(`"/Users/${functionsConfig.user1.uid}/Decks/<deckId>" exists in Firestore`, async function() {
          this.timeout(30000);
          deckDoc = await firestore.doc(`Users/${functionsConfig.user1.uid}/Decks/${user1DeckId}`).get();
          expect(deckDoc.exists).to.be.true;
        });
      
        it('The name of the parsed deck is "DRAGONS"', function() {
          expect(deckDoc.data().name).to.equal('DRAGONS');
        });
      
        it('The sum of all card quantities is 100', function() {
          const numberOfCards = _.map(deckDoc.data().cards, (value) => {
            return value.qty;
          }).reduce((accumulator, value, key, collection) => {
            return accumulator + value;
          }, 0);
  
          expect(numberOfCards).to.equal(100);
        });
      
        it('The commander is "The Ur-Dragon"', function() {
          // (Scryfall ID is 7e78b70b-0c67-4f14-8ad7-c9f8e3f59743)
          const commander = _.find(deckDoc.data().cards, (value) => {
            return value.board === Decklist.Board.COMMAND;
          });
          
          expect(commander.id).to.equal('7e78b70b-0c67-4f14-8ad7-c9f8e3f59743');
        });
      });
    });
  
    describe('Test importing a partner commander deck (2 commanders, 98 other)', function() {
      describe('Import a partner commander deck for user2, via Cloud Functions', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
            uid: functionsConfig.user2.uid,
            uri: functionsConfig.user2.deckURI,
          })
          .expect(201)
          .then(function (res) {
            user2DeckId = res.body.deckId;
          });
        });
      });
  
      describe('Validate the document in Firestore', function() {
        let deckDoc: Firestore.DocumentSnapshot;
        it(`"/Users/${functionsConfig.user2.uid}/Decks/<deckId>" exists in Firestore`, async function() {
          this.timeout(30000);
          deckDoc = await firestore.doc(`Users/${functionsConfig.user2.uid}/Decks/${user2DeckId}`).get();
          expect(deckDoc.exists).to.be.true;
        });
      
        it('The name of the parsed deck is "Example deck with partner commanders"', function() {
          expect(deckDoc.data().name).to.equal('Example deck with partner commanders');
        });
      
        it('The sum of all card quantities is 100', function() {
          const numberOfCards = _.map(deckDoc.data().cards, (value) => {
            return value.qty;
          }).reduce((accumulator, value, key, collection) => {
            return accumulator + value;
          }, 0);
  
          expect(numberOfCards).to.equal(100);
        });
      
        it('The commanders are "Akiri, Line-Slinger" and "Bruse Tarl, Boorish Herder"', function() {
          // (Scryfall IDs are 3b951e0c-a4dd-4a20-87c6-eaa947e33aa4 and 125b552b-45ea-4e0b-94a9-8131c97a04c0)
          let commanders = _.filter(deckDoc.data().cards, (value) => {
            return value.board === Decklist.Board.COMMAND;
          });
          commanders = _.sortBy(commanders, ['id']);
          
          expect(commanders).to.have.lengthOf(2);
          expect(commanders[0].id).to.equal('125b552b-45ea-4e0b-94a9-8131c97a04c0');
          expect(commanders[1].id).to.equal('3b951e0c-a4dd-4a20-87c6-eaa947e33aa4');
        });
      })
    });
  
    describe('Test importing a MTGGoldfish deck with an invalid or non-existent URI', function() {
      describe('Import a non-existent deck for user1, via Cloud Functions', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
            uid: functionsConfig.user1.uid,
            uri: 'https://www.mtggoldfish.com/deck/9999999999',
          })
          .expect(500); // TODO would be great to get a 400 back and a useful error message
        });
      });

      describe('Validate the document in Firestore', function() {
        it('No document was created', async function() {
          const decks = await firestore.collection(`Users/${functionsConfig.user1.uid}/Decks`).get();
          expect(decks.size).to.equal(1);
        });
      });
    });
  });

  describe('Tests for updateUserDocumentWithDeck', function() {
    it(`User ${functionsConfig.user1.uid} should list the DRAGONS deck`, async function() {
      this.timeout(30000);
      const userDocRef = firestore.doc(`Users/${functionsConfig.user1.uid}`);
      const userDoc = await TestUtils.attempt(async () => {
        const tempDoc = await userDocRef.get();
        if (!tempDoc.data().decks[user1DeckId]) {
          throw new Error(`Expected decks[${user1DeckId}] to exist`);
        }
        return tempDoc;
      })
      const deckInfo = userDoc.data().decks[user1DeckId];
      expect(deckInfo).to.not.be.undefined;
      expect(deckInfo.id).to.equal(user1DeckId);
      expect(deckInfo.name).to.equal('DRAGONS');
    });
  });
  
  describe('Tests for populateDeckFunction', function() {
    describe('Test populating for a deck', function() {
      describe('Populate the partner commander deck, including only fields "name" and "id"', function() {
        let response: supertest.Response;
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/populateDeckFunction')
          .send({
            uid: functionsConfig.user2.uid,
            deckId: user2DeckId,
            include: ['name', 'id'],
          })
          .expect(200)
          .then((res) => {
            response = res;
          });
        });

        it('Received data for four cards', function() {
          expect(response.body.cards).to.have.lengthOf(4);
        });

        it('The names for the four cards were returned', function() {
          const cards = response.body.cards;
          expect(_.some(cards, { name: 'Akiri, Line-Slinger' })).to.be.true;
          expect(_.some(cards, { name: 'Bruse Tarl, Boorish Herder' })).to.be.true;
          expect(_.some(cards, { name: 'Mountain' })).to.be.true;
          expect(_.some(cards, { name: 'Plains' })).to.be.true;
        });
      });
    });
  
    describe('Test populating a deck that does not exist', function() {
      describe('Populate a deck with id "FAKEID"', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/populateDeckFunction')
          .send({
            uid: functionsConfig.user2.uid,
            deckId: 'FAKEID',
            include: ['name', 'id'],
          })
          .expect(400);
        });
      });
    });
  });

  let gameId: string;
  describe('Tests for hostGameFunction', function() {
    describe('Test starting a game', function() {
      describe('Host a game with the "DRAGONS" deck as user1', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/hostGameFunction')
          .send({
            uid: functionsConfig.user1.uid,
            deckId: user1DeckId,
          })
          .expect(201)
          .then((res) => {
            gameId = res.body.gameId;
          })
        });
      });
  
      describe('Validate the document in Firestore', function() {
        let playerDoc: Firestore.DocumentSnapshot;
        it(`"Games/<gameId>/Players/${functionsConfig.user1.uid}" exists`, async function() {
          playerDoc = await firestore.doc(`Games/${gameId}/Players/${functionsConfig.user1.uid}`).get();
          expect(playerDoc.exists).to.be.true;
        });

        it('Validate player document', function() {
          expect(playerDoc.data().life).to.equal(40);
          expect(playerDoc.data().uid).to.equal(functionsConfig.user1.uid);
          expect(playerDoc.data().meta.deckId).to.equal(user1DeckId);
        });

        it(`"Games/<gameId>/Cards" contains 100 documents`, async function() {
          const cards = await firestore.collection(`Games/${gameId}/Cards`).get();
          expect(cards.size).to.equal(100);
        });

        let commanderDoc: Firestore.DocumentSnapshot;
        it('Collection contains 1 commander', async function() {
          const commander = await firestore.collection(`Games/${gameId}/Cards`)
            .where('state.zone', '==', Game.Zone.COMMAND)
            .get();
          expect(commander.docs).to.have.lengthOf(1);
          commanderDoc = commander.docs[0];
        });

        it('Validate commander card document', function() {
          expect(commanderDoc.data().scryfall_id).to.equal('7e78b70b-0c67-4f14-8ad7-c9f8e3f59743');
          expect(commanderDoc.data().state.zone).to.equal(Game.Zone.COMMAND);
          expect(commanderDoc.data().state.owner).to.equal(functionsConfig.user1.uid);
        });

        it('Valdiate game document', async function() {
          const gameDoc: Firestore.DocumentSnapshot = await firestore.doc(`Games/${gameId}`).get();
          expect(gameDoc.exists).to.be.true;

          expect(gameDoc.data().host.uid).to.equal(functionsConfig.user1.uid);
          expect(gameDoc.data().host.username).to.equal(functionsConfig.user1.uid);
          expect(gameDoc.data().guests).to.exist;
          expect(gameDoc.data().status).to.equal(GameStatus.PENDING);
        });


      });
    });
  });

  describe('Tests for joinGameFunction', function() {
    describe('Test joining a game', function() {
      describe('Join the game with the partner commander deck as user2', function() {
        it('Make the HTTP call', async function() {
          this.timeout(30000);
          await supertest(functionsConfig.baseURI)
          .post('/joinGameFunction')
          .send({
            gameId: gameId,
            uid: functionsConfig.user2.uid,
            deckId: user2DeckId,
          })
          .expect(204);
        });
      });

      describe('Validate the document in Firestore', function() {
        let playerDoc: Firestore.DocumentSnapshot;
        it(`"Games/<gameId>/Players/${functionsConfig.user2.uid}" exists`, async function() {
          playerDoc = await firestore.doc(`Games/${gameId}/Players/${functionsConfig.user2.uid}`).get();
          expect(playerDoc.exists).to.be.true;
        });

        it('Validate player document', function() {
          expect(playerDoc.data().life).to.equal(40);
          expect(playerDoc.data().uid).to.equal(functionsConfig.user2.uid);
          expect(playerDoc.data().meta.deckId).to.equal(user2DeckId);
        });

        it('Valdiate game document', async function() {
          const gameDoc: Firestore.DocumentSnapshot = await firestore.doc(`Games/${gameId}`).get();
          expect(gameDoc.exists).to.be.true;

          const guestEntry = gameDoc.data().guests[functionsConfig.user2.uid];
          expect(guestEntry.uid).to.equal(functionsConfig.user2.uid);
          expect(guestEntry.username).to.equal(functionsConfig.user2.uid);
          expect(gameDoc.data().status).to.equal(GameStatus.PENDING);
        });

        it(`"Games/<gameId>/Cards" contains 200 documents`, async function() {
          const cards = await firestore.collection(`Games/${gameId}/Cards`).get();
          expect(cards.size).to.equal(200);
        });

        it('Collection contains 3 commanders', async function() {
          const commander = await firestore.collection(`Games/${gameId}/Cards`)
            .where('state.zone', '==', Game.Zone.COMMAND)
            .get();
          expect(commander.docs).to.have.lengthOf(3);
        });

        it('Validate commander card document exists for partner commander 1', async function() {
          const commander = await firestore.collection(`Games/${gameId}/Cards`)
            .where('scryfall_id', '==', '3b951e0c-a4dd-4a20-87c6-eaa947e33aa4')
            .get();
          expect(commander.size).to.equal(1);

          const commanderDoc = commander.docs[0];
          expect(commanderDoc.data().scryfall_id).to.equal('3b951e0c-a4dd-4a20-87c6-eaa947e33aa4');
          expect(commanderDoc.data().state.zone).to.equal(Game.Zone.COMMAND);
          expect(commanderDoc.data().state.owner).to.equal(functionsConfig.user2.uid);
        });

        it('Validate commander card document exists for partner commander 2', async function() {
          const commander = await firestore.collection(`Games/${gameId}/Cards`)
            .where('scryfall_id', '==', '125b552b-45ea-4e0b-94a9-8131c97a04c0')
            .get();
          expect(commander.size).to.equal(1);

          const commanderDoc = commander.docs[0];
          expect(commanderDoc.data().scryfall_id).to.equal('125b552b-45ea-4e0b-94a9-8131c97a04c0');
          expect(commanderDoc.data().state.zone).to.equal(Game.Zone.COMMAND);
          expect(commanderDoc.data().state.owner).to.equal(functionsConfig.user2.uid);
        });
      });
    });
  });

  describe('Tests for startGameFunction', function() {
    describe('Start the game', function() {
      it('As user1, start the game', async function() {
        this.timeout(30000);
        await supertest(functionsConfig.baseURI)
        .post('/startGameFunction')
        .send({
          gameId,
        })
        .expect(204);
      });

      let gameDoc: Firestore.DocumentSnapshot;
      it('"Games/<gameId>" exists', async function() {
        gameDoc = await firestore.doc(`Games/${gameId}`).get();
        expect(gameDoc.exists).to.be.true;
      });

      it('Validate the document in Firestore', function() {
        const data = gameDoc.data();

        expect(data.turn_order).to.contain(functionsConfig.user1.uid);
        expect(data.turn_order).to.contain(functionsConfig.user2.uid);
        expect(data.status).to.equal(GameStatus.IN_PROGRESS);
      });
    });
  });

  describe('Clean up Admin SDK', function() {
    it('Delete the app', async function() {
      await app.delete();
    });
  });
});
