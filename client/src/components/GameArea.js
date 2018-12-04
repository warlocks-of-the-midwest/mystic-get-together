import React, { Component } from 'react';
import '../styles/GameArea.css';

class GameArea extends Component {
  test = () => {
    const { gameActions } = this.props;
    gameActions.decrementLife(-5);
  }

  render() {
    return (
      <div className="game-area">
        <div className="board">
        Main Board
        </div>
        <div className="side-area">
          <div className="temp">Life <button onClick={this.test} type="submit">Click</button></div>
          <div className="temp">Exile</div>
          <div className="temp">Grave</div>
          <div className="temp">Hand</div>
          <div className="temp">Library</div>
        </div>
      </div>
    );
  }
}

export default GameArea;
