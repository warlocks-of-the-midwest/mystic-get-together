import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
} from 'reactstrap';

import cardBack from '../card_back.jpg';
import Card from './Card.js';
import '../styles/Card.css';

class CurrentCard extends React.Component {
  render() {
    const { currentCard } = this.props;

    if (currentCard !== null) {
      return <Card card={currentCard} />;
    }

    return (
      <Container
        fluid
        style={{
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
        }}
      >
        <img className="cardBack" src={cardBack} alt="Magic card back" />
      </Container>
    );
  }
}
CurrentCard.propTypes = {
  currentCard: PropTypes.array.isRequired,
};
export default CurrentCard;
