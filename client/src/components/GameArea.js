import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'

import Child from './Child';

import '../styles/GameArea.css';

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.setLifeCallback = this.setLifeCallback.bind(this);
    this.increment = this.increment.bind(this);

    sdk.listenToPlayer("player1", this.setLifeCallback)
  }

  setLifeCallback(docData) {
    const { gameActions } = this.props;
    gameActions.setLife(docData.life)
  }

  increment(newLife) {
    console.log("setting life?");
    sdk.updateLife("player1", newLife)
  }

  /*decrementLife = () => {
    const { gameActions } = this.props;
    gameActions.decrementLife();
  }*/

  render() {
    const { gameState } = this.props;
    const { life } = gameState;

    return (
      <div className="game-area">
        <div className="board">
          Main Board
          <Child life={life} />
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
