import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store';

import GameStateContainer from './containers/GameStateContainer';
import * as serviceWorker from './serviceWorker';

import './styles/index.css';

const app = (
  <Provider store={configureStore()}>
    <GameStateContainer />
  </Provider>);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
