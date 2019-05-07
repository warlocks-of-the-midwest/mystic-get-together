import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';

import { getAvailableDecks } from '../js-sdk/sdk';

const HostGameModal = ({ user, isOpen, toggle, handleSubmit }) => {
  const [availableDecks, setAvailableDecks] = useState([]);
  const [selectedDeckId, updateSelectedDeck] = useState(null);

  const handleSelect = (e) => {
    updateSelectedDeck(e.target.dataset.id);
  };

  const submit = () => {
    handleSubmit(selectedDeckId);
  };

  useEffect(() => {
    const getDecks = async () => {
      const response = await getAvailableDecks(user.uid);
      const decks = Object.keys(response)
        .map((d) => response[d])
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

      setAvailableDecks(decks);
    };

    if (user) {
      getDecks();
    }
  }, [user]);

  return (
    <Modal data-modal-type="host" isOpen={isOpen} toggle={toggle}>
      <ModalHeader data-modal-type="host" toggle={toggle}>Choose a deck</ModalHeader>
      <ModalBody>
        <ListGroup>
          {availableDecks.map((deck) => <ListGroupItem data-id={deck.id} onClick={handleSelect} active={selectedDeckId === deck.id}>{deck.name}</ListGroupItem>)}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>Host Game</Button>
        <Button data-modal-type="host" color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default HostGameModal;
