import React, { useState, useContext } from 'react';
import ImportDeckModal from './ImportDeckModal';
import HostGameModal from './HostGameModal';
import JoinGameModal from './JoinGameModal';

import { UserContext } from '../context/userContext';
import { importDeck, hostGame, joinGame } from '../api';

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
      <a className="btn" onClick={toggleHostModal}>Host Game</a>
      <a className="btn" onClick={toggleJoinModal}>Join Game</a>
      <a className="btn" onClick={toggleImportModal}>Import Deck</a>
      <a className="btn" onClick={signOut}>Log Out</a>
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
      {/* <h1 className="mystic">Mystic The Get-Together</h1> */}
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
