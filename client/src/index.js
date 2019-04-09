import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store';

import { UserProvider } from './context/userContext';
import GameContainer from './containers/GameContainer';
import LandingPage from './components/LandingPage';
import withAuthentication from './components/withAuthentication';

import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const App = () => (
  <UserProvider>
    <Provider store={configureStore()}>
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/board" component={withAuthentication(GameContainer)} />
        </Switch>
      </Router>
    </Provider>
  </UserProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
