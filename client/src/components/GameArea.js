import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/GameArea.css';

class GameArea extends Component {
  decrementLife = () => {
    const { gameActions } = this.props;
    gameActions.decrementLife(-5);
  }

  render() {
    const { gameState } = this.props;

    return (
      <div className="game-area">
        <div className="board">
        Main Board
        </div>
        <div className="side-area">
          <div className="temp">Life: {gameState.life} <button onClick={this.decrementLife} type="submit">Click</button></div>
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
