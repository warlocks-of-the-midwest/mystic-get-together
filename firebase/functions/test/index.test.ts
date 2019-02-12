import 'mocha';
import { expect } from 'chai';
import * as _ from 'lodash';
import * as supertest from 'supertest';
import * as Firestore from '@google-cloud/firestore';

import * as Decklist from '../src/decklist';

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
  let user1DeckId: String;
  let user2DeckId: String;

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
        let deckDoc:Firestore.DocumentSnapshot;
        it('"/Users/<uid>/Decks/<deckId>" exists in Firestore', async function() {
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
        it('do it again', async function() {
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
  
      describe('The data is good', function() {
        it('/Users/<uid>/Decks/<deckId> exists in Firestore', function() {
        });
      
        it('The name of the parsed deck is "Example deck with partner commanders"', () => {
          // TODO
        });
      
        it('The sum of all card quantities is 100', () => {
          // TODO
        });
      
        it('The commanders are "Akiri, Line-Slinger" and "Bruse Tarl, Boorish Herder"', () => {
          // (Scryfall IDs are 3b951e0c-a4dd-4a20-87c6-eaa947e33aa4 and 125b552b-45ea-4e0b-94a9-8131c97a04c0)
          // TODO
        });
      })
      
    });
  
    describe('Test importing a deck that is not for commander', () => {
      it('Import a non-commander deck for user1, via Cloud Functions', () => {
        // https://www.mtggoldfish.com/deck/1630110#paper
        // Assert that the function returns an error
      });
  
      it('No deck was created in Firestore', () => {
  
      });
    })
  
    describe('Test importing a deck with an invalid or non-existent URI', () => {
      it('* Import `https://www.mtggoldfish.com/deck/1630110FAKE#paper`', () => {
        // Assert that the function returns an error
      });
  
      it('No deck was created in Firestore', () => {
  
      });
    })
  });
  

  // Tests for populateDeckFunction

  describe('Test populating for a deck', () => {
    // * Populate the partner commander deck, including only the fields `name` and `id`.

    // Assert that we get back data for all four unique cards
    // * We should see the names `Akiri, Line-Slinger`, `Bruse Tarl, Boorish Herder`, `Mountain`, and `Plains`
  });

  describe('Test populating a deck that does not exist', () => {
    // * Populate a deck with id `FAKEID`
    // * Assert that the function returns an error
  });

  // Tests for hostGameFunction

  let gameId;
  describe('Test starting a game', () => {
    describe('* Host a game with the DRAGONS deck as user 1', () => {
      it('api call', async function() {
        console.log(`user1: ${user1DeckId} and user2: ${user2DeckId}`)
      });
    });

    describe('data is good', function() {
      it('* Assert that `Games/<gameId>/Players/<userId>` exists, and has', ()=> {
        // * `life` set to 40
        // * `uid` set to
        // * `meta.deck_id` set to the correct value for the DRAGONS deck
      });
    
      it('* Assert that `Games/<gameId>/Cards` contains 100 documents', () => {
    
      });
    
      it ('* Assert that the collection contains exactly 1 document where `scryfall_id` equals `7e78b70b-0c67-4f14-8ad7-c9f8e3f59743`, `state.zone` equals `Command`, and `state.owner` equals <userId for user 1>', () => {
    
      });
    });

    
  });

  // Tests for joinGameFunction

  describe('Test joining a game', () => {
    it('* Join a game with the partner commander deck as user 2', () => {

    });

    // Assert that `Games/<gameId>/Players/<userId>` exists, and has
    // * `life` set to 40
    // * `uid` set to
    // * `meta.deck_id` set to the correct value for the partner commander deck

    // * Assert that `Games/<gameId>/Cards` contains 200 documents
    // * Assert that the collection contains exactly 1 document where `scryfall_id` equals `3b951e0c-a4dd-4a20-87c6-eaa947e33aa4`, `state.zone` equals `Command`, and `state.owner` equals <userId for user 2>
    // * Assert that the collection contains exactly 1 document where `scryfall_id` equals `125b552b-45ea-4e0b-94a9-8131c97a04c0`, `state.zone` equals `Command`, and `state.owner` equals <userId for user 2>
  });

  // Tests for startGameFunction

  describe('Start the game', () => {
    // * As user1, start the game
    // * Assert that `Games/<gameId>` has a `turn_order` field, containing properties `0` and `1`, one of which points to user1 and the other to user2
  });
});
