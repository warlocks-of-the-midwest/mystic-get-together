import React, { Component } from 'react';
import '../styles/GameArea.css';

class GameArea extends Component {
  render() {
    return (
      <div className="game-area">
        <div className="board">
        Main Board
        </div>
        <div className="side-area">
          <div className="temp">Life</div>
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
