import React from 'react';
import './styles/index.css';

export const Zones = {
  LIBRARY: 'library',
  HAND: 'hand',
  BATTLEFIELD: 'battlefield',
  GRAVEYARD: 'graveyard',
  STACK: 'stack',
  EXILE: 'exile',
  COMMAND: 'command',
};

export const Centered = ({ children }) => (
  <div className="centered-container">
    {children}
  </div>
);
