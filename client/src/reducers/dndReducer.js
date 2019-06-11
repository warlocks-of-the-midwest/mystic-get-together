import _ from 'lodash';

export const DNDActions = {
  UPDATE_POSITION: 'UPDATE_POSITION',
};

const dndReducer = (state, action) => {
  switch (action.type) {
    case DNDActions.UPDATE_POSITION: {
      const { draggableId, source, destination } = action;
      const newState = { ...state };

      // remove card from old position
      const sourceCardList = _.find(newState.rows, { id: source.droppableId }).cards;
      sourceCardList.splice(source.index, 1);

      // add card in new position
      const targetCardList = _.find(newState.rows, { id: destination.droppableId }).cards;
      targetCardList.splice(destination.index, 0, draggableId);

      return {
        ...newState,
      };
    }
    default:
      return state;
  }
};

export default dndReducer;
