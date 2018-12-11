// TODO - remove; demo purposes only
import React from 'react';
import PropTypes from 'prop-types';

const CardChild = (props) => {
  const { card } = props;

  return (
    <div>I'm a card child! Card: {JSON.stringify(card)}</div>
  );
};

CardChild.propTypes = {
  card: PropTypes.shape({}).isRequired,
};

export default CardChild;
