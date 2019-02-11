import React from 'react';
import PropTypes from 'prop-types';
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
    sdk.listenToZone('player1', 'zone1', this.loadCards);
  }

  loadCards(data) {
    const { gameActions } = this.props;
    const cards = _.map(_.keys(data), (cardId) => data[cardId]);
    const scryfallIds = _.map(cards, (card) => _.get(card, 'scryfall_id', null));

    const requests = _.map(scryfallIds, async (scryfallId) => {
      let response = await fetch(`https://api.scryfall.com/cards/${scryfallId}?format=json`);
      const scryfallJson = await response.json();
      const { id, set_uri, ...scryfallData } = scryfallJson;

      response = await fetch(set_uri);
      const setJson = await response.json();
      const { icon_svg_uri } = setJson;

      return Promise.resolve({ icon_svg_uri, ...scryfallData });
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

GameContainer.propTypes = {
  gameState: PropTypes.shape({}).isRequired,
  gameActions: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  gameActions: bindActionCreators(gameStateActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
