import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/Card.css';

import 'bootstrap/dist/js/bootstrap.bundle.js';

import {
  Container,
  Row,
  Col,
  Media,
} from 'reactstrap';
import * as sdk from '../js-sdk/sdk';


class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
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
      <Container
        fluid
        className="card-container d-flex flex-column justify-content-center border rounded p-0 m-0"
        style={{
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
        }}
      >
        {/* Image row with a col wrapper to control size of image */}
        <Row
          className="card-art-row justify-content-center no-gutters flex-grow-1 flex-shrink-1"
          style={{
            'flex-basis': '40%',
            //minHeight: '40%',
            //maxHeight: '80%',
            overflow: 'hidden',
          }}
        >
          <Col xs="12" className="card-art-col p-0 ">
            <Media
              obj
              className="card-art-image img-fluid d-block mx-auto"
              alt="Card Art"
              src={card.getImage()}
            />
          </Col>
        </Row>
        {/* Power and toughness if creature */}
        <Row
          className="card-power-toughness-row d-inline-flex no-gutters justify-content-between flex-grow-1 flex-shrink-0"
          style={{
            overflow: 'hidden',
            flexBasis: '1.4vw',
            'font-size': '.75vw',
            //'max-height': '1.5vw',
          }}
        >
          <Col className="px-0 d-flex flex-shrink-0 flex-grow-2">
            <button
              tabIndex="0"
              color="link"
              block
              size="sm"
              className="text-dark font-weight-bold bg-transparent m-0 p-0 align-top text-left text-wrap "
              data-toggle="popover"
              data-trigger="focus"
              title={card.getName()}
              data-content={card.getType()}
              id="Popover"
              style={{
                'text-overflow': 'ellipsis',
                overflow: 'hidden',
              }}
            >
              Creature
              {String()}
            </button>
          </Col>
          <Col className="card-power-toughness-col px-0 d-flex flex-shrink-0 flex-grow-2 justify-content-end">
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-power-toughness text-dark font-weight-bold bg-transparent m-0 p-0 align-top text-right text-wrap "
              data-toggle="popover"
              data-trigger="focus"
              title={card.getName()}
              data-content={card.getType()}
              id="Popover"
              style={{
                'text-overflow': 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {card.getPowerToughness()}
              {String()}
            </button>
          </Col>
        </Row>

      </Container>
    );
  }
}

Card.propTypes = {
  card: PropTypes.shape({}).isRequired,
};

export default Card;
