import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Card.css';

import 'bootstrap/dist/js/bootstrap.bundle.js';

import {
  Container,
  Row,
  Col,
  Media,
} from 'reactstrap';


class CardStub extends React.Component {
  render() {
    const { card } = this.props;

    return (
      <Container
        style={{
          'border-style': 'solid',
          'border-width': '0.1rem',
        }}
      >
        {/* Card name */}
        <Row
          style={{
            height: 'auto',
          }}
        >
          <Col>
            <div
              className="truncated-text"
              style={{
                'vertical-align': 'text-bottom',
                'font-size': '0.8rem',
                'text-overflow': 'ellipsis',
                overflow: 'hidden',
                'white-space': 'nowrap',
              }}
            >
              {card.getName()}
            </div>
          </Col>
        </Row>
        {/* Image row with a col wrapper to control size of image */}
        <Row>
          <Col>
            <Media
              obj
              style={{
                width: '100%',
                height: 'auto',
              }}
              alt="Card Art"
              src={card.getImage()}
            />
          </Col>
        </Row>
        {/* Power and toughness if creature */}
        <Row
          style={{
            height: 'auto',
          }}
        >
          <Col>
            <span
              style={{
                'vertical-align': 'text-bottom',
                'font-size': '0.8rem',
                float: 'left',
              }}
            >
              {card.getShortType()}
            </span>
          </Col>
          <Col>
            <span
              style={{
                'vertical-align': 'text-bottom',
                'font-size': '0.8rem',
                float: 'right',
              }}
            >
              {card.getPowerToughness()}
            </span>
          </Col>
        </Row>
      </Container>
    );
  }
}

CardStub.propTypes = {
  card: PropTypes.shape({}).isRequired,
};

export default CardStub;
