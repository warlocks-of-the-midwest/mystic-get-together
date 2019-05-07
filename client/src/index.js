import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { UserProvider } from './context/userContext';
import { GameProvider } from './context/gameContext';
import LandingPage from './components/LandingPage';
import GameArea from './components/GameArea';
import withAuthentication from './components/withAuthentication';

import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const AuthenticatedGameProvider = withAuthentication(GameProvider);

const GameContainer = (props) => (
  <AuthenticatedGameProvider {...props}>
    <GameArea cards={[]} />
  </AuthenticatedGameProvider>
);

const app = (
  <UserProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/games/:gameId" render={(props) => <GameContainer {...props} />} />
        <Route exact path="/board" render={(props) => <GameContainer {...props} />} />
      </Switch>
    </Router>
  </UserProvider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
