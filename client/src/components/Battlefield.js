import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dragula from 'react-dragula';

import Card from './Card.js';

import { Zones } from '../helpers';

class Battlefield extends Component {
  constructor(props) {
    super(props);

    this.PlayerInfoBox = this.PlayerInfoBox.bind(this);
    this.gridContainerRef = React.createRef();

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

  componentDidUpdate() {
    dragula([this.gridContainerRef.current], {
      moves: function(el, container, handle) {
        return el.classList.contains('cardContainer');
      }
    });
  }

  PlayerInfoBox(props) {
    const { player, shouldRender } = props;

    if (shouldRender && player) {
      return (
        <div
          style={{
            'border-style': 'solid',
            'border-width': '0.1rem',
            margin: '-4px',
            width: '90%',
            height: '0%',
            minHeight: '100px',
          }}
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
        </div>
      );
    }

    return (null);
  }

  render() {
    const { cards, player } = this.state;
    const { isFullView, strongBorder } = this.props;

    return (
      <div
        fluid
        className="cards-rows-container p-0 m-0"
        style={{
          height: '100%',
          border: strongBorder ? 'solid' : 'none',
        }}
      >
        {/* if there is no player, just leave battlefield empty */}
        { player ? (
          <div
            style={{
              display: 'grid',
              'grid-template-columns': 'repeat(auto-fill, 150px)',
              gap: '10px',
              margin: '5px',
            }}
            ref={this.gridContainerRef}
          >
            <this.PlayerInfoBox player={player} shouldRender={isFullView} />
            {cards
              .filter((card) => _.get(card, 'state.zone') === Zones.BATTLEFIELD)
              .map((card) => (
                <Card isStub={isFullView} card={card} />
              ))}
          </div>
        ) : (
          null
        )}
      </div>
    );
  }
}

Battlefield.propTypes = {
  cards: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  isFullView: PropTypes.bool.isRequired,
  strongBorder: PropTypes.bool.isRequired,
};

export default Battlefield;
