import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const JoinGameModal = ({ isOpen, toggle, handleSubmit }) => {
  const [deckId, updateDeckId] = useState('');
  const [gameId, updateGameId] = useState('');

  const handleDeckInput = (e) => {
    updateDeckId(e.target.value);
  };

  const handleGameInput = (e) => {
    updateGameId(e.target.value);
  };

  const submit = () => {
    handleSubmit(deckId, gameId);
  };

  return (
    <Modal data-modal-type="join" isOpen={isOpen} toggle={toggle}>
      <ModalHeader data-modal-type="join" toggle={toggle}>Join Game</ModalHeader>
      <ModalBody>
        Input game ID
        <Input placeholder="gameId" onChange={handleGameInput} />
        Input deck ID
        <Input placeholder="deckId" onChange={handleDeckInput} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>Join</Button>
        <Button data-modal-type="join" color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default JoinGameModal;
