import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';

import { getAvailableGames, getAvailableDecks } from '../js-sdk/sdk';

const JoinGameModal = ({ user, isOpen, toggle, handleSubmit }) => {
  const [availableDecks, setAvailableDecks] = useState([]);
  const [selectedDeckId, updateSelectedDeck] = useState(null);
  const [availableGames, setAvailableGames] = useState([]);
  const [selectedGameId, updateSelectedGame] = useState(null);

  const handleDeckSelect = (e) => {
    updateSelectedDeck(e.target.dataset.id);
  };

  const handleGameSelect = (e) => {
    updateSelectedGame(e.target.dataset.id);
  };

  const submit = () => {
    handleSubmit(selectedDeckId, selectedGameId);
  };

  useEffect(() => {
    const getGames = async () => {
      const response = await getAvailableGames();
      const games = Object.keys(response).map((d) => response[d]);
      setAvailableGames(games);
    };

    getGames();
  }, []);

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
    <Modal data-modal-type="join" isOpen={isOpen} toggle={toggle}>
      <ModalHeader data-modal-type="join" toggle={toggle}>Join Game</ModalHeader>
      <ModalBody>
        Select a deck
        <ListGroup>
          {availableDecks.map((deck) => <ListGroupItem data-id={deck.id} onClick={handleDeckSelect} active={selectedDeckId === deck.id}>{deck.name}</ListGroupItem>)}
        </ListGroup>
        <br />
        Select a game
        <ListGroup>
          {availableGames.map((game) => <ListGroupItem data-id={game.uid} onClick={handleGameSelect} active={selectedGameId === game.uid}>{game.uid}</ListGroupItem>)}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>Join</Button>
        <Button data-modal-type="join" color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default JoinGameModal;
