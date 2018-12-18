import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'

import Child from './Child';
import CardChild from './CardChild';

import '../styles/GameArea.css';

import { Jumbotron, Button } from 'reactstrap';

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.player1Callback = this.player1Callback.bind(this);
    this.player1ZoneCallback = this.player1ZoneCallback.bind(this);
    this.increment = this.increment.bind(this);
    this.toggleCard = this.toggleCard.bind(this);

    sdk.listenToPlayer("player1", this.player1Callback)
    sdk.listenToZone("player1", "zone1", this.player1ZoneCallback)
  }

  player1Callback(docData) {
    const { gameActions } = this.props;
    gameActions.updatePlayer("player1", docData)
  }

  player1ZoneCallback(docData) {
    const { gameActions } = this.props;
    gameActions.updateZone("player1", "zone1", docData)
  }

  increment(newLife) {
    sdk.updateLife("player1", newLife)
  }

  toggleCard(card) {
    if (card["state.tapped"]) {
      sdk.untap(card)
    }
    else {
      sdk.tap(card)
    }
  }

  render() {
    const { gameState } = this.props;
    const { life } = gameState.Players.player1;
    const { card1 } = gameState.Players.player1.Zones.zone1;
    const { card2 } = gameState.Players.player1.Zones.zone1;

    return (
      <div className="game-area">
        <div className="board">
          Main Board
          <Child life={life} />
          <CardChild card={card1} />
          <button onClick={ () => this.toggleCard(card1)} type="submit">Click</button>
          <CardChild card={card2} />
          <button onClick={ () => this.toggleCard(card2)} type="submit">Click</button>
        </div>
        <div className="side-area">
          <div className="temp">Life: {life} <button onClick={ () => this.increment((Math.floor(Math.random() * 100)))} type="submit">Click</button></div>
          <div className="temp">Exile</div>
          <div className="temp">Grave</div>
          <div className="temp">Hand</div>
          <div className="temp">Library</div>
        </div>
      </div>
    );
  }
}

GameArea.propTypes = {
  gameState: PropTypes.shape({}).isRequired,
  gameActions: PropTypes.shape({}).isRequired,
};

export default GameArea;
