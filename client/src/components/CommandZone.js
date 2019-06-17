import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
} from 'reactstrap';
import '../styles/Zones.css';

import Card from './Card.js';

class CommandZone extends Component {
  constructor(props) {
    super(props);

    const { cardList } = this.props;

    this.state = {
      cardList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cardList } = nextProps;
    this.setState({
      cardList,
    });
  }

  render() {
    const { cardList } = this.state;

    return (
      <Col xs="12" className="border p-1" onClick={this.toggle}>
        <h6
          className="font-weight-bold text-wrap"
          style={{ 'font-size': '50%' }}
        >
          Command Zone
        </h6>
        <div
          style={{
            display: 'grid',
            'grid-template-columns': '150px',
            gap: '10px',
            margin: '5px',
          }}
        >
          {cardList
            .map((card) => (
              <Card card={card} />
            ))}
        </div>
      </Col>
    );
  }
}

CommandZone.propTypes = {
  cardList: PropTypes.array.isRequired,
};

export default CommandZone;
