import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Card from './Card.js';

import { Zones } from '../helpers';

class Battlefield extends Component {
  constructor(props) {
    super(props);

    const { cards } = this.props;
    this.state = {
      cards,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cards } = nextProps;
    this.setState({
      cards,
    });
  }

  render() {
    const { cards } = this.state;
    const { useStubs, strongBorder } = this.props;

    return (
      <div
        fluid
        className="cards-rows-container p-0 m-0"
        style={{
          height: '100%',
          border: strongBorder ? 'solid' : 'none',
        }}
      >
        <div
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
              <Card isStub={useStubs} card={card} />
            ))}
        </div>
      </div>
    );
  }
}

Battlefield.propTypes = {
  cards: PropTypes.array.isRequired,
  useStubs: PropTypes.bool.isRequired,
  strongBorder: PropTypes.bool.isRequired,
};

export default Battlefield;
