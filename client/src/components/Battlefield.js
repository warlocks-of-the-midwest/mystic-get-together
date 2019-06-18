import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Card from './Card.js';
import PlayerInfoBox from './PlayerInfoBox.js';

import { Zones } from '../helpers';

import '../styles/Battlefield.css';

class Battlefield extends Component {
  constructor(props) {
    super(props);

    const { cards, player } = this.props;
    this.state = {
      cards,
      player,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cards, player } = nextProps;
    this.setState({
      cards,
      player,
    });
  }

  render() {
    const { cards, player } = this.state;
    const { isFullView, strongBorder, infoBoxPosition } = this.props;

    let positionClass = 'rightBattlefield';
    if (infoBoxPosition === 'right') {
      positionClass = 'leftBattlefield';
    }

    return (
      <div
        fluid
        className={`cards-rows-container p-0 m-0 ${isFullView ? 'fullBattlefieldContainer' : ''}`}
        style={{
          height: '100%',
          border: strongBorder ? 'solid' : 'none',
        }}
      >
        {/* if there is no player, just leave battlefield empty */}
        { player && infoBoxPosition === 'left' ? (
          <PlayerInfoBox
            player={player}
            shouldRender={isFullView}
          />
        ) : (
          null
        )}
        { player ? (
          <div
            className={isFullView ? positionClass : ''}
            style={{
              display: 'grid',
              'grid-template-columns': 'repeat(auto-fill, 150px)',
              gap: '10px',
              margin: '5px',
            }}
          >
            {cards
              .filter((card) => _.get(card, 'state.zone') === Zones.BATTLEFIELD)
              .map((card) => (
                <Card isStub={isFullView} card={card} />
              ))}
          </div>) : (
          null
        )}
        { player && infoBoxPosition === 'right' ? (
          <PlayerInfoBox
            player={player}
            shouldRender={isFullView}
          />
        ) : (
          null
        )}
      </div>
    );
  }
}

Battlefield.defaultProps = {
  infoBoxPosition: 'left',
};

Battlefield.propTypes = {
  cards: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  isFullView: PropTypes.bool.isRequired,
  strongBorder: PropTypes.bool.isRequired,
  infoBoxPosition: PropTypes.string,
};

export default Battlefield;
