import db from './fire';

// Listeners
export function listenToZone(player, zone, callback) {
  db.doc(`Games/game1/Players/${player}/Zones/${zone}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

export function listenToPlayer(player, callback) {
  db.doc(`Games/game1/Players/${player}`)
    .onSnapshot((doc) => {
      callback(doc.data())
    });
}

// Game functions
export function tap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = true
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function untap(card) {
  var playerName = card["state.owner"];
  var zoneName = card["state.zone"];
  card["state.tapped"] = false
  db.doc(`Games/game1/Players/${playerName}/Zones/${zoneName}`)
    .update({
      [card.id]: card
    })
}

export function updateLife(player, newLife) {
  db.doc(`Games/game1/Players/${player}`)
    .update({
      life: newLife
    })
}