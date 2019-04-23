import _ from 'lodash';

class CardInfo {
  constructor(cardJson) {
    const { id, image_uris, mana_cost, name, oracle_text, power, scryfall_id, set_name, toughness,
      type_line, icon_svg_uri, state } = cardJson;

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
    this.setImgUrl = icon_svg_uri;
    this.state = state;
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

  getImage() {
    return this.imgUrl;
  }

  getType() {
    return this.type;
  }

  getShortType() {
    let shortType = '';
    if (this.type.includes('Creature')) {
      shortType += 'Creature ';
    }
    if (this.type.includes('Enchantment')) {
      shortType += 'Enchantment ';
    }
    if (this.type.includes('Artifact')) {
      shortType += 'Artifact ';
    }
    if (this.type.includes('Land')) {
      shortType += 'Land ';
    }
    if (this.type.includes('Instant')) {
      shortType += 'Instant ';
    }
    if (this.type.includes('Sorcery')) {
      shortType += 'Sorcery ';
    }
    if (this.type.includes('Planeswalker')) {
      shortType += 'Planeswalker ';
    }
    return shortType;
  }

  getSetName() {
    return this.setName;
  }

  getSetImage() {
    return this.setImgUrl;
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
    return this.isCreature() ? `${this.power}/${this.toughness}` : null;
  }

  isCreature() {
    return _.includes(_.toLower(this.type), 'creature');
  }

  isTapped() {
    return this.state.tapped;
  }

  setState(state) {
    this.state = state;
  }
}

export default CardInfo;
