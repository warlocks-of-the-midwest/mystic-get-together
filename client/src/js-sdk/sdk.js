import db from './fire';

export function listenToZone(zone, callback) {
  db.collection("CardsExample").doc(zone)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function tap(card) {
  //TODO how will this sdk determine where the card is by id?
  // just defaulting to 'zone1' now
  db.collection("CardsExample").doc("zone1").update({
    [card]: {
      "state.tapped": true
    }
  })
}

export function untap(card) {
  //TODO how will this sdk determine where the card is by id?
  // just defaulting to 'zone1' now
  db.collection("CardsExample").doc("zone1").update({
    [card]: {
      "state.tapped": false
    }
  })
}