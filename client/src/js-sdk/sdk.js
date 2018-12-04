import db from './fire';

// Track card players and zones in game document
var cardZoneData;
db.collection("CardsExample").doc("game1")
  .onSnapshot((doc) => {
    cardZoneData = doc.data()
  });

export function listenToZone(player, zone, callback) {
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(player).collection("Zones").doc(zone)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function tap(card) {
  //TODO how will this sdk determine where the card is by id?
  //This is my possibly temporary solution.
  //Find player and zone from map in game document.
  var playerName = cardZoneData.cardZoneMap[card].player;
  var zoneName = cardZoneData.cardZoneMap[card].zone;
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(playerName).collection("Zones").doc(zoneName).update({
      [card]: {
        "state.tapped": true
      }
    })
}

export function untap(card) {
  //TODO how will this sdk determine where the card is by id?
  //This is my possibly temporary solution.
  //Find player and zone from map in game document.
  var playerName = cardZoneData.cardZoneMap[card].player;
  var zoneName = cardZoneData.cardZoneMap[card].zone;
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(playerName).collection("Zones").doc(zoneName).update({
      [card]: {
        "state.tapped": false
      }
    })
}