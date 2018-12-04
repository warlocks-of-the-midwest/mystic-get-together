// TODO - remove; demo purposes only
import React from 'react';
import PropTypes from 'prop-types';

const Child = (props) => {
  const { life } = props;

  return (
    <div>I'm a child! Life: {life}</div>
  );
};

Child.propTypes = {
  life: PropTypes.number.isRequired,
};

export default Child;
