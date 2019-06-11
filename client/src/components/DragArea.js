import _ from 'lodash';
import React, { useReducer } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { GameContext } from '../context/gameContext';
import Card from './Card';

import '../styles/GameArea.css';
import CardInfo from '../models/cardInfo';
import dndReducer, { DNDActions } from '../reducers/dndReducer';

const initialData = {
  cards: [
    { 'id': 'card1', 'imgUrl': 'https://img.scryfall.com/cards/art_crop/front/f/6/f6135cf4-50c2-4e44-b9b0-96e1187a2200.jpg?1538879509', 'manaCost': '{1}{R}', 'cardText': 'Lava Coil deals 4 damage to target creature. If that creature would die this turn, exile it instead.', 'name': 'Lava Coil', 'scryfallId': 'f6135cf4-50c2-4e44-b9b0-96e1187a2200', 'setName': 'Guilds of Ravnica', 'type': 'Sorcery', 'setImgUrl': 'https://img.scryfall.com/sets/grn.svg?1557115200', 'state': { 'attachments': { 'counters': {}, 'permanents': {} }, 'clone_of': null, 'controller': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'face_up': false, 'is_morph': false, 'is_token': false, 'owner': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'position': 58, 'power': null, 'tapped': false, 'toughness': null, 'zone': 'battlefield' } },
    { 'id': 'card2', 'imgUrl': 'https://img.scryfall.com/cards/art_crop/en/m19/156.jpg?1531452592', 'manaCost': '{R}', 'cardText': 'Shock deals 2 damage to any target.', 'name': 'Shock', 'scryfallId': 'bf5a0e1e-5239-41f3-a63f-d9303b1b01fc', 'setName': 'Core Set 2019', 'type': 'Instant', 'setImgUrl': 'https://img.scryfall.com/sets/m19.svg?1557115200', 'state': { 'attachments': { 'counters': {}, 'permanents': {} }, 'clone_of': null, 'controller': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'face_up': false, 'is_morph': false, 'is_token': false, 'owner': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'position': 29, 'power': null, 'tapped': false, 'toughness': null, 'zone': 'battlefield' } },
    { 'id': 'card3', 'imgUrl': 'https://img.scryfall.com/cards/art_crop/front/5/f/5ffd5cb7-7002-4c9e-b04f-6ee6d168afc3.jpg?1548379797', 'manaCost': '{3}{R}{R}', 'cardText': 'When Siege-Gang Commander enters the battlefield, create three 1/1 red Goblin creature tokens.\n{1}{R}, Sacrifice a Goblin: Siege-Gang Commander deals 2 damage to any target.', 'name': 'Siege-Gang Commander', 'power': '2', 'scryfallId': '5ffd5cb7-7002-4c9e-b04f-6ee6d168afc3', 'setName': 'Game Night', 'toughness': '2', 'type': 'Creature — Goblin', 'setImgUrl': 'https://img.scryfall.com/sets/gnt.svg?1557115200', 'state': { 'attachments': { 'counters': {}, 'permanents': {} }, 'clone_of': null, 'controller': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'face_up': false, 'is_morph': false, 'is_token': false, 'owner': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'position': 37, 'power': null, 'tapped': false, 'toughness': null, 'zone': 'battlefield' } },
    { 'id': 'card4', 'imgUrl': 'https://img.scryfall.com/cards/art_crop/front/b/e/bee125cb-12b9-4f78-8e1d-6018d9c52275.jpg?1538879853', 'manaCost': '{G}', 'cardText': "Whenever another creature you control enters the battlefield or dies, if that creature's power is greater than Pelt Collector's, put a +1/+1 counter on Pelt Collector.\nAs long as Pelt Collector has three or more +1/+1 counters on it, it has trample.", 'name': 'Pelt Collector', 'power': '1', 'scryfallId': 'bee125cb-12b9-4f78-8e1d-6018d9c52275', 'setName': 'Guilds of Ravnica', 'toughness': '1', 'type': 'Creature — Elf Warrior', 'setImgUrl': 'https://img.scryfall.com/sets/grn.svg?1557115200', 'state': { 'attachments': { 'counters': {}, 'permanents': {} }, 'clone_of': null, 'controller': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'face_up': false, 'is_morph': false, 'is_token': false, 'owner': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'position': 72, 'power': null, 'tapped': false, 'toughness': null, 'zone': 'graveyard' } },
    { 'id': 'card5', 'imgUrl': 'https://img.scryfall.com/cards/art_crop/front/f/6/f6135cf4-50c2-4e44-b9b0-96e1187a2200.jpg?1538879509', 'manaCost': '{1}{R}', 'cardText': 'Lava Coil deals 4 damage to target creature. If that creature would die this turn, exile it instead.', 'name': 'Lava Coil', 'scryfallId': 'f6135cf4-50c2-4e44-b9b0-96e1187a2200', 'setName': 'Guilds of Ravnica', 'type': 'Sorcery', 'setImgUrl': 'https://img.scryfall.com/sets/grn.svg?1557115200', 'state': { 'attachments': { 'counters': {}, 'permanents': {} }, 'clone_of': null, 'controller': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'face_up': false, 'is_morph': false, 'is_token': false, 'owner': '4qRyPIOmr2YYLt9xil5CXBL0n4l1', 'position': 56, 'power': null, 'tapped': false, 'toughness': null, 'zone': 'Graveyard' } },
  ],
  rows: [
    {
      id: 'row1',
      title: 'Cards1',
      cards: ['card1', 'card2'],
    },
    {
      id: 'row2',
      title: 'Cards2',
      cards: ['card3'],
    },
    {
      id: 'row3',
      title: 'Cards3',
      cards: ['card4', 'card5'],
    },
  ],
};

const DragArea = (props) => {
  // TODO use real game data to populate initial data
  const [dndState, dispatch] = useReducer(dndReducer, initialData);

  const updatePosition = (result) => {
    const { draggableId, source, destination } = result;

    // return it to its original position if not dropped in a droppable
    if (!destination) {
      return null;
    }

    dispatch({ type: DNDActions.UPDATE_POSITION, draggableId, source, destination });
  };

  const content = (
    <div className="drag-container">
      {_.map(dndState.rows, (row) => (
        // START ROW/AREA COMPONENT MAYBE
        <Droppable droppableId={row.id} direction="horizontal">
          {(provided2) => (
            <div className="card-row" ref={provided2.innerRef}>
              {_.map(row.cards, (cardId, index) => {
                // START DROPPABLE CARD
                const currentCard = new CardInfo(_.find(dndState.cards, { id: cardId }));
                return (
                  <Draggable
                    key={currentCard.getId()}
                    draggableId={currentCard.getId()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        <div className="card-container">
                          <Card isStub card={currentCard} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
                // END DROPPABLE CARD
              })}
              {provided2.placeholder}
            </div>
          )}
        </Droppable>
        // END ROW/AREA COMPONENT MAYBE
      ))}
    </div>
  );

  return (
    <DragDropContext onDragEnd={updatePosition}>
      {content}
    </DragDropContext>
  );
};

export default DragArea;
