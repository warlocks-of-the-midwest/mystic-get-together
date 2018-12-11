import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Child from './Child';

import '../styles/GameArea.css';
import Card from './Card.js';
import Hand from './Hand.js';
import '../styles/Card.css';
import '../styles/Hand.css';

class GameArea extends Component {
  decrementLife = () => {
    const { gameActions } = this.props;
    gameActions.decrementLife();
  }

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
          <div className="temp">Life: {life} <button onClick={this.decrementLife} type="submit">Click</button></div>
          <div className="temp">Exile</div>
          <div className="temp">Grave</div>
          <div className="temp">
            <h1>Hand</h1>
            <Card 

            />
          </div>
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
