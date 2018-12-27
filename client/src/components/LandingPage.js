import React, { Component } from 'react';
import '../styles/LandingPage.css';

// TODO Update the href values when you know what pages they should link to
class LandingPage extends Component {
  render() {
    return (
      <section className="intro">
        <div className="inner">
          <div className="content">
            <h1>Mystic The Get Together</h1>
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
      </section>
    );
  }
}

export default LandingPage;
