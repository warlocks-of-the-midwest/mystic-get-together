import _ from 'lodash';

class CardInfo {
  // CardInfo constructor takes raw JSON
  // TODO -- set symbol url
  constructor(cardJson) {
    const { id, image_uris, mana_cost, name, oracle_text, power, scryfall_id, set_name, toughness, type_line } = cardJson;

    this.id = id;
    this.imgUrl = image_uris.art_crop;
    this.manaCost = mana_cost;
    this.cardText = oracle_text;
    this.name = name;
    this.power = power;
    this.scryfallId = scryfall_id;
    this.setName = set_name;
    this.toughness = toughness;
    this.type = type_line;
    this._translateCardState(cardJson);
  }

  getId() {
    return this.id;
  }

  getScryfallId() {
    return this.scryfallId;
  }

  getName() {
    return this.name;
  }

  getManaCost() {
    return this.manaCost;
  }

  getImageUrl() {
    return this.imgUrl;
  }

  getType() {
    return this.type;
  }

  getSetName() {
    return this.setName;
  }

  getCardText() {
    return this.cardText;
  }

  getPower() {
    return this.isCreature() ? this.power : null;
  }

  getToughness() {
    return this.isCreature() ? this.toughness : null;
  }

  getPowerToughness() {
    return this.isCreature() ? `${this.getPower()}/${this.getToughness()}` : null;
  }

  isCreature() {
    return _.includes(_.toLower(this.getType()), 'creature');
  }

  isTapped() {
    return this.state.tapped;
  }

  _translateCardState(cardJson) {
    const stateProperties = _.filter(_.keys(cardJson), (propertyName) => _.includes(propertyName, 'state'));
    const state = _.reduce(stateProperties, (stateObj, propertyName) => {
      const name = _.last(_.split(propertyName, '.'));
      return {
        ...stateObj,
        [name]: _.get(cardJson, propertyName, null),
      };
    }, {});
    this.state = { ...state };
  }
}

export default CardInfo;
