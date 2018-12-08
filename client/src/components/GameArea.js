import React, { Component } from 'react';
import '../styles/GameArea.css';
import Card from './Card.js';
import Hand from './Hand.js';
import '../styles/Card.css';
import '../styles/Hand.css';

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

export default GameArea;
