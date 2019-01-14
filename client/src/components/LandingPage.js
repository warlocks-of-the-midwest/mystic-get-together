import React, { Component } from 'react';
import '../styles/LandingPage.css';

class LandingPage extends Component {
  render() {
    return (
      <div>
        <img src={require('../components/images/lotus.jpg')} alt="lotus" className="lotus" />
        <div>
          <h1 className="mystic">Mystic The Get-Together</h1>
          <div className="buttonsAndSelect">
            <a className="btn" href="/">Host Game</a>
            <a className="btn" href="/">Join Game</a>
            <a className="btn" href="/">Show Deck</a>
            <select>
              <option selected disabled>Select User</option>
              <option value="">Andrew</option>
              <option value="">Anthony</option>
              <option value="">Eric</option>
              <option value="">Henry</option>
              <option value="">Jake</option>
              <option value="">Khalid</option>
              <option value="">Priyanka</option>
              <option value="">Vincent</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
