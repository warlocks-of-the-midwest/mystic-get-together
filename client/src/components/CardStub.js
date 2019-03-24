import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Card.css';

import 'bootstrap/dist/js/bootstrap.bundle.js';

class CardStub extends React.Component {
  render() {
    const { card } = this.props;

    return (
      <div
        style={{
          'border-style': 'solid',
          'border-width': '0.1rem',
          height: '100%',
          display: 'grid',
          'grid-template-rows': 'repeat(8, 1fr)',
        }}
      >
        {/* Card name */}
        <div
          className="truncated-text"
        >
          {card.getName()}
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
        {/* Shortened type and Power/Toughness */}
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            className="truncated-text"
            style={{
              flex: '0 0 70%',
            }}
          >
            {card.getShortType()}
          </div>
          <div
            style={{
              'font-size': '0.8rem',
              'text-align': 'right',
              flex: '1',
            }}
          >
            {card.getPowerToughness()}
          </div>
        </div>
      </div>
    );
  }
}

CardStub.propTypes = {
  card: PropTypes.shape({}).isRequired,
};

export default CardStub;
