import 'mocha';
import { expect } from 'chai';
import * as _ from 'lodash';
import * as supertest from 'supertest';
import * as Firestore from '@google-cloud/firestore';

import * as Decklist from '../src/decklist';
import * as Game from '../src/game';
import request = require('request');

// Firestore client
const firestore = new Firestore.Firestore({
  projectId: 'mystic-the-get-together-test',
  // This file is NOT checked in to Git
  keyFilename: 'service-account-credentials.json',
  timestampsInSnapshots: true
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

  // Tests for importDeckFunction
  let user1DeckId: string;
  let user2DeckId: string;

  describe('Tests for importDeckFunction', function() {
    describe('Test importing a standard commander deck (1 commander, 99 other)', () => {
      describe('Import a standard commander deck for user1, via Cloud Function', () => {
        it('Make the HTTP call', async function() {
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
              player: functionsConfig.user1.uid,
              uri: functionsConfig.user1.deckURI,
          })
          .expect(200)
          .then(function (res) {
            user1DeckId = res.header['x-deckid'];
          });
        });
      });
  
      describe('Validate the document in Firestore', function() {
        let deckDoc: Firestore.DocumentSnapshot;
        it(`"/Users/${functionsConfig.user1.uid}/Decks/<deckId>" exists in Firestore`, async function() {
          this.timeout(5000);
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
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
            player: functionsConfig.user2.uid,
            uri: functionsConfig.user2.deckURI,
          })
          .expect(200)
          .then(function (res) {
            user2DeckId = res.header['x-deckid'];
          });
        });
      });
  
      describe('Validate the document in Firestore', function() {
        let deckDoc: Firestore.DocumentSnapshot;
        it(`"/Users/${functionsConfig.user2.uid}/Decks/<deckId>" exists in Firestore`, async function() {
          this.timeout(5000);
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
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/importDeckFunction')
          .send({
            player: functionsConfig.user1.uid,
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
  
  describe('Tests for populateDeckFunction', function() {
    describe('Test populating for a deck', function() {
      describe('Populate the partner commander deck, including only fields "name" and "id"', function() {
        let response: supertest.Response;
        it('Make the HTTP call', async function() {
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/populateDeckFunction')
          .send({
            player: functionsConfig.user2.uid,
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
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/populateDeckFunction')
          .send({
            player: functionsConfig.user2.uid,
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
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/hostGameFunction')
          .send({
            player: functionsConfig.user1.uid,
            deckId: user1DeckId,
          })
          .expect(201)
          .then((res) => {
            gameId = res.header['x-gameid'];
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

        it(`Games/<gameId>/Cards contains 100 documents`, async function() {
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
      });
    });
  });

  describe('Tests for joinGameFunction', function() {
    describe('Test joining a game', function() {
      describe('Join the game with the partner commander deck as user2', function() {
        it('Make the HTTP call', async function() {
          this.timeout(15000);
          await supertest(functionsConfig.baseURI)
          .post('/joinGameFunction')
          .send({
            gameId: gameId,
            player: functionsConfig.user2.uid,
            deckId: user2DeckId,
          })
          .expect(200);
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

        it(`Games/<gameId>/Cards contains 200 documents`, async function() {
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
      // * As user1, start the game
      // * Assert that `Games/<gameId>` has a `turn_order` field, containing properties `0` and `1`, one of which points to user1 and the other to user2
    });
  });  
});
