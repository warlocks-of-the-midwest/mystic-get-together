import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/Card.css';

import 'bootstrap/dist/js/bootstrap.bundle.js';

import * as sdk from '../js-sdk/sdk';


class Card extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
  }

  toggleCard(card) {
    if (card['state.tapped']) {
      sdk.untap(card);
    } else {
      sdk.tap(card);
    }
  }

  render() {
    const { card } = this.props;

    return (
      <div
        style={{
          'border-style': 'solid',
          'border-width': '0.1rem',
          height: '100%',
          'max-width': '150px',
          display: 'grid',
          'grid-template-rows': 'repeat(11, 1fr)',
          'grid-template-columns': 'minmax(0, 1fr)',
        }}
      >
        {/* Card name and mana cost */}
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            className="truncated-text"
            style={{
              flex: '0 0 55%',
            }}
          >
            {card.getName()}
            <div
              className="truncated-text-tooltip"
            >
              {card.getName()}
            </div>
          </div>
          <div
            style={{
              'font-size': '0.5rem',
              'text-align': 'right',
              flex: '1',
            }}
          >
            {card.getManaCost()}
          </div>
        </div>
        {/* Card image */}
        <div
          style={{
            'background-image': `url(${card.getImage()})`,
            'background-repeat': 'no-repeat',
            'background-size': 'contain',
            'grid-row': 'span 6',
          }}
        />
        {/* Card type and set image */}
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            className="truncated-text"
            style={{
              flex: '0 0 70%',
              'font-size': '0.6rem',
            }}
          >
            {card.getType()}
            <div
              className="truncated-text-tooltip"
            >
              {card.getType()}
            </div>
          </div>
          <div
            style={{
              flex: '1',
              'background-image': `url(${card.getSetImage()})`,
              'background-repeat': 'no-repeat',
              'background-size': 'contain',
              'background-position': 'right',
            }}
          />
        </div>
        {/* Card text */}
        <div
          className="card-text"
        >
          {card.getCardText()}
          <div
            className="card-text-tooltip"
          >
            {card.getCardText()}
          </div>
        </div>
        {/* Power/Toughness */}
        <div
          style={{
            'font-size': '0.6rem',
            'text-align': 'right',
          }}
        >
          {card.getPowerToughness()}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.shape({}).isRequired,
};

export default Card;
