import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import GameArea from '../components/GameArea';
import gameStateActions from '../redux/actions/gameStateActions';

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  gameActions: bindActionCreators(gameStateActions, dispatch),
});

const GameStateContainer = connect(mapStateToProps, mapDispatchToProps)(GameArea);

export default GameStateContainer;
