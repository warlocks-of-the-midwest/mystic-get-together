import _ from 'lodash';
import React, { useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { GameContext } from '../context/gameContext';
import Card from './Card';

import '../styles/GameArea.css';
import CardInfo from '../models/cardInfo';

const DroppableRow = (props) => {
  const content = (
    <Draggable draggableId={card.id} index={index}>
      {(provided2) => (
        <div className="card-container">
          <Card isStub card={new CardInfo(initialData.cards[card])} />
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={updatePosition}>
      {content}
    </DragDropContext>
  );
};

export default DroppableRow;
