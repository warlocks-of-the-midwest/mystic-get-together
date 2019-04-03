import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const ImportDeckModal = ({ isOpen, toggle, handleSubmit }) => {
  const [deckUri, updateDeckUri] = useState('');

  const handleInput = (e) => {
    updateDeckUri(e.target.value);
  };

  const submit = () => {
    handleSubmit(deckUri);
  };

  return (
    <Modal data-modal-type="import" isOpen={isOpen} toggle={toggle}>
      <ModalHeader data-modal-type="import" toggle={toggle}>Import Deck</ModalHeader>
      <ModalBody>
        <Input placeholder="https://www.mtggoldfish.com/deck/" onChange={handleInput} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>Import</Button>
        <Button data-modal-type="import" color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImportDeckModal;
