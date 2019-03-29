import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const HostGameModal = ({ isOpen, toggle, handleSubmit }) => {
  const [deckId, updateDeckId] = useState('');

  const handleInput = (e) => {
    updateDeckId(e.target.value);
  };

  const submit = () => {
    handleSubmit(deckId);
  };

  return (
    <Modal data-modal-type="host" isOpen={isOpen} toggle={toggle}>
      <ModalHeader data-modal-type="host" toggle={toggle}>Host Game</ModalHeader>
      <ModalBody>
        Input deck ID
        <Input placeholder="deckId" onChange={handleInput} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>Host</Button>
        <Button data-modal-type="host" color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default HostGameModal;
