export const importDeck = async (uid, uri) => {
  try {
    const res = await fetch('https://us-central1-mystic-get-together.cloudfunctions.net/importDeckFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, uri }),
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
};

export const hostGame = async (uid, deckId) => {
  try {
    const res = await fetch('https://us-central1-mystic-get-together.cloudfunctions.net/hostGameFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, deckId }),
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
};

export const joinGame = async (uid, deckId, gameId) => {
  try {
    const res = await fetch('https://us-central1-mystic-get-together.cloudfunctions.net/joinFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, deckId, gameId }),
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
};

export const startGame = async (gameId) => {
  try {
    const res = await fetch('https://us-central1-mystic-get-together.cloudfunctions.net/hostGameFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
};

export const parseDeck = async (uri) => {
  try {
    const res = await fetch('https://us-central1-mystic-get-together.cloudfunctions.net/parseDeckFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri }),
    });
    return res;
  } catch (ex) {
    console.log(ex);
  }
};
