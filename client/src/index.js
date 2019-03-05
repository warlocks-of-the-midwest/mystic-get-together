import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store';

import GameContainer from './containers/GameContainer';
import LandingPage from './components/LandingPage';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const app = () => (
  <Provider store={configureStore()}>
    <GameContainer />
  </Provider>
);

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/board" component={app} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
