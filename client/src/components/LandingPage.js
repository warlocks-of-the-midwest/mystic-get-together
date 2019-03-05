import React, { Component } from 'react';

import { auth, googleProvider } from '../js-sdk/fire';
import * as sdk from '../js-sdk/sdk';

import lotus from '../lotus.jpg';
import '../styles/LandingPage.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('signed in');
        console.log(user);
        this.setState({
          user,
        });
      } else {
        console.log('signed out');
        this.setState({
          user: null,
        });
      }
    });
  }

  async signIn() {
    const userData = await auth.signInWithPopup(googleProvider);
  }

  renderButtons() {
    const { user } = this.state;
    const loginButton = (
      <button className="btn" onClick={this.signIn} type="button">Login</button>
    );
    const gameButtons = (
      <div className="stacked">
        <a className="btn" href="/">Host Game</a>
        <a className="btn" href="/">Join Game</a>
        <a className="btn" href="/">Show Deck</a>
      </div>
    );
    return user ? gameButtons : loginButton;
  }

  render() {
    return (
      <div className="lotus">
        {/* <h1 className="mystic">Mystic The Get-Together</h1> */}
        <div className="buttonsAndSelect">
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default LandingPage;
