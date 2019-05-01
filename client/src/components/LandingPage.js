import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import ImportDeckModal from './ImportDeckModal';
import HostGameModal from './HostGameModal';
import JoinGameModal from './JoinGameModal';

import { UserContext } from '../context/userContext';
import { importDeck, hostGame, joinGame } from '../js-sdk/sdk';

import '../styles/LandingPage.css';

const LandingPage = () => {
  const { user, signIn, signOut } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [createdGameId, setGameId] = useState(null);
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

  const handleHost = async (deckId) => {
    const { uid } = user;
    const game = await hostGame(uid, deckId);
    const { gameId } = game.data;
    toggleHostModal(false);
    setGameId(gameId);
    setRedirect(true);
  };

  const handleJoin = (deckId, gameId) => {
    const { uid } = user;
    joinGame(uid, deckId, gameId);
    toggleJoinModal(false);
    setGameId(gameId);
    setRedirect(true);
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

  const content = (
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
        user={user}
        isOpen={isHostModalOpen}
        toggle={toggle}
        handleSubmit={handleHost}
      />
      <JoinGameModal
        user={user}
        isOpen={isJoinModalOpen}
        toggle={toggle}
        handleSubmit={handleJoin}
      />
    </div>
  );

  return redirect ? <Redirect to={`/games/${createdGameId}`} /> : content;
};

export default LandingPage;
