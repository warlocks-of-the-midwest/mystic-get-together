import React from 'react';
import './styles/index.css';

export const Zones = {
  LIBRARY: 'Library',
  HAND: 'Hand',
  BATTLEFIELD: 'Battlefield',
  GRAVEYARD: 'Graveyard',
  STACK: 'Stack',
  EXILE: 'Exile',
  COMMAND: 'Command',
};

export const Centered = ({ children }) => (
  <div className="centered-container">
    {children}
  </div>
);
