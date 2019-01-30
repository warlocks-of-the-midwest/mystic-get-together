import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as sdk from '../js-sdk/sdk';

import GameArea from '../components/GameArea';
import gameStateActions from '../redux/actions/gameStateActions';

class GameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.loadCards = this.loadCards.bind(this);
  }

  componentDidMount() {
    // sdk.listenToPlayer('player1', this.player1Callback);
    sdk.listenToZone('player1', 'zone1', this.loadCards);
  }

  loadCards(data) {
    const { gameActions } = this.props;
    const cards = _.map(_.keys(data), (cardId) => data[cardId]);
    const scryfallIds = _.map(cards, (card) => _.get(card, 'scryfall_id', null));

    const requests = _.map(scryfallIds, async (id) => {
      const response = await fetch(`https://api.scryfall.com/cards/${id}?format=json`);
      const scryfallData = await response.json();
      const {
        name,
        mana_cost,
        image_uris,
        type_line,
        set_name,
        oracle_text,
        power,
        toughness,
      } = scryfallData;

      const img_url = image_uris.art_crop;

      return Promise.resolve({ name, mana_cost, img_url, type_line, set_name, oracle_text, power, toughness });
    });

    Promise.all(requests)
      .then((sData) => {
        gameActions.loadCards(_.merge(cards, sData));
      });
  }

  render() {
    const { gameState } = this.props;

    return (
      <GameArea
        cards={gameState.cards}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  gameActions: bindActionCreators(gameStateActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
