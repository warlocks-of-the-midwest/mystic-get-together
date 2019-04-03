import React, { useState, useContext } from 'react';
import ImportDeckModal from './ImportDeckModal';
import HostGameModal from './HostGameModal';
import JoinGameModal from './JoinGameModal';

import { UserContext } from '../context/userContext';
import { importDeck, hostGame, joinGame } from '../js-sdk/sdk';

import '../styles/LandingPage.css';

const LandingPage = () => {
  const { user, signIn, signOut } = useContext(UserContext);
  const [isImportModalOpen, toggleImportModal] = useState(false);
  const [isHostModalOpen, toggleHostModal] = useState(false);
  const [isJoinModalOpen, toggleJoinModal] = useState(false);

  const loginButton = (
    <button className="btn" onClick={signIn} type="button">Login</button>
  );

  const gameButtons = (
    <div className="stacked">
      <button type="button" className="btn" onClick={toggleHostModal}>Host Game</button>
      <button type="button" className="btn" onClick={toggleJoinModal}>Join Game</button>
      <button type="button" className="btn" onClick={toggleImportModal}>Import Deck</button>
      <button type="button" className="btn" onClick={signOut}>Log Out</button>
    </div>
  );

  const handleImport = (deckUri) => {
    const { uid } = user;
    importDeck(uid, deckUri);
    toggleImportModal(false);
  };

  const handleHost = (deckId) => {
    const { uid } = user;
    hostGame(uid, deckId);
    toggleHostModal(false);
  };

  const handleJoin = (deckId, gameId) => {
    const { uid } = user;
    joinGame(uid, deckId, gameId);
    toggleJoinModal(false);
  };

  const toggle = (e) => {
    switch (e.target.dataset.modalType) {
      case 'import':
        toggleImportModal(!isImportModalOpen);
        break;
      case 'host':
        toggleHostModal(!isHostModalOpen);
        break;
      case 'join':
        toggleJoinModal(!isJoinModalOpen);
        break;
      default:
        // this is so that clicking outside the modal closes it too
        toggleImportModal(false);
        toggleHostModal(false);
        toggleJoinModal(false);
        break;
    }
  };

  return (
    <div className="lotus">
      <div className="buttonsAndSelect">
        {user ? gameButtons : loginButton}
      </div>
      <ImportDeckModal
        isOpen={isImportModalOpen}
        toggle={toggle}
        handleSubmit={handleImport}
      />
      <HostGameModal
        isOpen={isHostModalOpen}
        toggle={toggle}
        handleSubmit={handleHost}
      />
      <JoinGameModal
        isOpen={isJoinModalOpen}
        toggle={toggle}
        handleSubmit={handleJoin}
      />
    </div>
  );
};

export default LandingPage;
