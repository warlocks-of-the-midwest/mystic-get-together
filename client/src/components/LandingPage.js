import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import { UserContext } from '../context/userContext';
import { auth, googleProvider } from '../js-sdk/fire';

import '../styles/LandingPage.css';

const LandingPage = () => {
  const user = useContext(UserContext);
  const [isImportModalOpen, toggleImportModal] = useState(false);
  const [deckUri, updateDeckUri] = useState('');

  const signIn = async () => {
    auth.signInWithPopup(googleProvider);
  };

  const handleImportInput = (e) => {
    updateDeckUri(e.target.value);
  };

  const handleSubmit = () => {
    // call importDeckFunction() cloud function with deckUri and user uid
    console.log(deckUri);
  };

  const toggle = () => {
    toggleImportModal(!isImportModalOpen);
  };

  const loginButton = (
    <button className="btn" onClick={signIn} type="button">Login</button>
  );

  const gameButtons = (
    <div className="stacked">
      <a className="btn" href="/">Host Game</a>
      <a className="btn" href="/">Join Game</a>
      <a className="btn" onClick={toggleImportModal}>Import Deck</a>
      <a className="btn">Log Out</a>
    </div>
  );

  const renderButtons = () => (user ? gameButtons : loginButton);

  console.log(user);

  return (
    <div className="lotus">
      {/* <h1 className="mystic">Mystic The Get-Together</h1> */}
      <div className="buttonsAndSelect">
        {renderButtons()}
      </div>
      <Modal isOpen={isImportModalOpen} toggle={toggleImportModal}>
        <ModalHeader toggle={toggleImportModal}>Import Deck</ModalHeader>
        <ModalBody>
          <Input placeholder="https://www.mtggoldfish.com/deck/" onChange={handleImportInput} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Import</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LandingPage;
