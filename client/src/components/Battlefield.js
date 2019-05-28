import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Card from './Card.js';

import { Zones } from '../helpers';

import '../styles/Battlefield.css';

class Battlefield extends Component {
  constructor(props) {
    super(props);

    this.PlayerInfoBox = this.PlayerInfoBox.bind(this);

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

  PlayerInfoBox(props) {
    const { player, shouldRender, position } = props;

    let positionClass = 'leftInfoBar';
    if (position === 'right') {
      positionClass = 'rightInfoBar';
    }

    if (shouldRender && player) {
      return (
        <div
          className={`infoBar ${positionClass}`}
        >
          <div>Username:</div>
          <div
            style={{
              'font-size': '0.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {player.getUsername()}
          </div>
          <div>Life Total: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >{player.getLife()}
            </span>
          </div>
          <div>Infect: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >{player.getCounters('poison')}
            </span>
          </div>
          <div>Energy: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >{player.getCounters('energy')}
            </span>
          </div>
          <div>Experience: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >{player.getCounters('experience')}
            </span>
          </div>
          <div>CMDR 1: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >3
            </span>
          </div>
          <div>CMDR 2: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >0
            </span>
          </div>
          <div>CMDR 3: <span
            style={{
              'font-size': '1.7em',
              'text-overflow': 'ellipsis',
              overflow: 'hidden',
            }}
            >8
            </span>
          </div>
        </div>
      );
    }

    return (null);
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
          <this.PlayerInfoBox
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
          <this.PlayerInfoBox
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
