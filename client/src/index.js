import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
//import GameArea from './components/GameArea';
import CardTapExampleZone from './components/CardTapExampleZone';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<CardTapExampleZone />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
