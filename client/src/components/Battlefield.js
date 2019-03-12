import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

import CardStub from './CardStub.js';
import Card from './Card.js';

import { Zones } from '../constants.js';

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

  CardComponent(props) {
    if (props.isStub) {
      return <CardStub card={props.card} />;
    }
    return <Card card={props.card} />;
  }

  render() {
    const { cards } = this.state;
    const { useStubs } = this.props;

    return (
      <Container
        fluid
        className="cards-rows-container p-0 m-0"
        style={{
          height: '100%',
        }}
      >
        {/* Top row of battlefield */}
        <Row
          className="p-0 m-0 border"
          style={{
            height: '50%',
          }}
        >
          {/* Main area for cards */}
          <Row
            className="m-0"
          >
            {cards
              .filter((card) => _.get(card, 'state.zone') === Zones.BATTLEFIELD)
              .map((card) => (
                <Col
                  xs="2"
                  className="no-gutters"
                >
                  <Col
                    xs="12"
                    className="no-gutters"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <this.CardComponent isStub={useStubs} card={card} />
                  </Col>
                  <Col
                    xs="1"
                    className="no-gutters"
                  />
                </Col>
              ))}
          </Row>
        </Row>

        {/* Bottom row of cards */}
        <Row
          className="p-0 m-0 border"
          style={{
            height: '50%',
          }}
        >
          <Row
            className="m-0"
          >
            {cards
              .filter((card) => _.get(card, 'state.zone') === Zones.EXILE)
              .map((card) => (
                <Col
                  xs="2"
                  className="no-gutters"
                >
                  <Col
                    xs="12"
                    className="no-gutters"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <this.CardComponent isStub={useStubs} card={card} />
                  </Col>
                  <Col
                    xs="1"
                    className="no-gutters"
                  />
                </Col>
              ))}
          </Row>
        </Row>
      </Container>
    );
  }
}

Battlefield.propTypes = {
  cards: PropTypes.array.isRequired,
  useStubs: PropTypes.bool.isRequired,
};

export default Battlefield;
