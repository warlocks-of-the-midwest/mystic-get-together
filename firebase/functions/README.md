# Cloud Functions for Mystic the Get-together

Before deploying these functions, make sure to edit `../.firebaserc` to target your Firebase project. 

You will also need to ensure that:
- you are on the Blaze (pay as you go) plan 
    - this can be done easily from the Firebase console
    - this requires a billing account to be setup
- the necessary APIs are enabled
    - Cloud Firestore API
        - this can be done from the Google Cloud console

There is configuration required for these functions. Currently, it is just making the WrapAPI key available. You can do so by calling `firebase functions:config:set wrapapi.key="API KEY HERE"`

I haven't figured out if you can set configuration when running the local emulator, so currently, when in the emulator, replace calls to `functions.config().wrapapi.key` with the actual key value.

You can deploy these functions by running `firebase deploy --only functions`

## Running Tests

Integration tests are provided and should be run against a dedicated test project
(make sure the Firebase CLI defaults to your test project).

- Make sure you have service account credentials available by following
(these instructions)[https://cloud.google.com/docs/authentication/getting-started]
and copying the key file to `service-account-credentials.json`
- Deploy the functions using `npm run deploy`
- Run the tests using `npm run fb-clean && npm test`
  - Note that the `fb-clean` script will wipe partial data from the database

## API Examples
```bash
export FIREBASE_FUNCTION_BASE_URL=https://us-central1-mystic-the-get-together-test.cloudfunctions.net

# Import a deck from MTGGoldfish for a player
importDeckFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" uid=eric uri=https://www.mtggoldfish.com/deck/1511674
}

# A player hosts a game using a specific deck that player owns
# The deckId can be gleaned from the headers of the importDeckFunction response
hostGameFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" uid=eric deckId=?
}

# A player joins an existing game using a specific deck that player owns
# The gameId can be gleaned from the headres of the hostGameFunction response
joinGameFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" uid=anthony deckId=?
}

# Start the target game by determining the turn order
startGameFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" gameId=?
}

# Clients may want to get Scryfall data for cards in the game
# The deckId value is set as part of the player document
populateDeckFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" uid=eric deckId=? include:='["id"]'
}

# Of use for a deck editor
parseDeckFunction() {
    http -v POST "${FIREBASE_FUNCTION_BASE_URL}/${0}" uri=https://www.mtggoldfish.com/deck/1511674
}
```