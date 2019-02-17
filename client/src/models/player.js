import _ from 'lodash';

class Player {
  constructor(playerJson) {
    const { uid, username, life } = playerJson;

    this.id = uid;
    this.username = username;
    this.life = life;
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
}

export default Player;
