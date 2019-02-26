import _ from 'lodash';
import React, { Component } from 'react';
import {
  ListGroup, ListGroupItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

class CardList extends Component {
  render() {
    const { listClickHandler, cardList, searchTerm } = this.props;

    return (
      <ListGroup className="zone-modal-list">
        {cardList
          .filter((card) => _.includes(card.getName().toLowerCase(), searchTerm))
          .map((card) => (
            <ListGroupItem
              key={card.getName()}
              onClick={listClickHandler}
              id={card.getId()}
            >
              {card.getName()}
            </ListGroupItem>
          ))}
      </ListGroup>
    );
  }
}
CardList.propTypes = {
  listClickHandler: PropTypes.func.isRequired,
  cardList: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CardList;
