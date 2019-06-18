import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Battlefield from './Battlefield.js';
import { GameContext } from '../context/gameContext';

class FullBattlefield extends Component {
  render() {
    const { cards, players } = this.context.gameState;

    return (
      <div
        style={{
          display: 'grid',
          'grid-template-columns': '1fr 1fr',
          height: '100%',
        }}
      >
        <Battlefield cards={cards} player={players[0]} isFullView strongBorder infoBoxPosition="right" />
        <Battlefield cards={cards} player={players[1]} isFullView strongBorder infoBoxPosition="left" />
        <Battlefield cards={cards} player={players[2]} isFullView strongBorder infoBoxPosition="right" />
        <Battlefield cards={cards} player={players[3]} isFullView strongBorder infoBoxPosition="left" />
      </div>
    );
  }
}

FullBattlefield.contextType = GameContext;

export default FullBattlefield;
