import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as sdk from '../js-sdk/sdk';

import '../styles/GameContainer.css';

import GameArea from '../components/GameArea';
import Battlefield from '../components/Battlefield';
import gameStateActions from '../redux/actions/gameStateActions';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';

const GAME_ID = 'pCc44llUV5JVRjfl0YqZ'; // hard-coded for debugging

class GameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.playerUpdate = this.playerUpdate.bind(this);
    this.cardUpdate = this.cardUpdate.bind(this);
    this.loadCards = this.loadCards.bind(this);
  }

  async componentDidMount() {
    const { gameActions } = this.props;

    const playerPromise = sdk.loadPlayers(GAME_ID);
    const cardPromise = sdk.loadCards(GAME_ID);

    const [playerData, cardData] = await Promise.all([playerPromise, cardPromise]);

    _.forEach(playerData, (player) => {
      const { uid } = player;
      sdk.listenToPlayer(GAME_ID, uid, this.playerUpdate);
    });
    gameActions.loadPlayers(playerData);

    _.forEach(cardData, (card) => {
      const { id } = card;
      sdk.listenToCard(GAME_ID, id, this.cardUpdate);
    });
    this.loadCards(cardData);
  }

  playerUpdate(data) {
    // console.log('player callback');
    // console.log(data);
    // TODO update player in reducer array
  }

  cardUpdate(data) {
    // console.log('card callback');
    // console.log(data);
    // TODO update card in reducer array
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
      <Container>
        <Row>
          <Col>
            <Battlefield cards={gameState.cards}/>
          </Col>
          <Col>
            <Battlefield cards={gameState.cards}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Battlefield cards={gameState.cards}/>
          </Col>
          <Col>
            <Battlefield cards={gameState.cards}/>
          </Col>
        </Row>
      </Container> 
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
