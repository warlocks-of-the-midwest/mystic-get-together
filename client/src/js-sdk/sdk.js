import db from './fire';

// Listeners
export function listenToZone(player, zone, callback) {
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(player).collection("Zones").doc(zone)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function listenToPlayer(player, callback) {
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(player)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

// Game functions
export function tap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = true
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(playerName).collection("Zones").doc(zoneName).update({
      [card.id]: card
    })
}

export function untap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = false
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(playerName).collection("Zones").doc(zoneName).update({
      [card.id]: card
    })
}

export function updateLife(player, newLife) {
  db.collection("CardsExample").doc("game1").collection("Players").
    doc(player).update({
      life: newLife
    })
}