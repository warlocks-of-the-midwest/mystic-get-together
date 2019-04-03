import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Battlefield from './Battlefield.js';

class FullBattlefield extends Component {
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

    return (
      <div
        style={{
          display: 'grid',
          'grid-template-columns': '1fr 1fr',
          height: '100%',
        }}
      >
        <Battlefield cards={cards} useStubs strongBorder />
        <Battlefield cards={cards} useStubs strongBorder />
        <Battlefield cards={cards} useStubs strongBorder />
        <Battlefield cards={cards} useStubs strongBorder />
      </div>
    );
  }
}

FullBattlefield.propTypes = {
  cards: PropTypes.array.isRequired,
};

export default FullBattlefield;
