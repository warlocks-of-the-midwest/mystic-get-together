class Player {
  constructor(playerJson) {
    const { uid, username, life, counters } = playerJson;

    this.id = uid;
    this.username = username;
    this.life = life;
    this.counters = counters;
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getLife() {
    return this.life;
  }

  getCounters(counterType) {
    return this.counters[counterType];
  }
}

export default Player;
