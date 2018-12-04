import React, { Component } from 'react';
import * as sdk from '../js-sdk/sdk'

class CardTapExampleZone extends Component {
  constructor(props) {
    super(props);
    this.toggleCard1 = this.toggleCard1.bind(this);
    this.toggleCard2 = this.toggleCard2.bind(this);
    this.toggleCard3 = this.toggleCard3.bind(this);
    this.toggleCard4 = this.toggleCard4.bind(this);
    this.toggleCard5 = this.toggleCard5.bind(this);
    this.player1zone1Listener = this.player1zone1Listener.bind(this);
    this.player1zone2Listener = this.player1zone2Listener.bind(this);
    this.player2zone1Listener = this.player2zone1Listener.bind(this);
    this.player2zone2Listener = this.player2zone2Listener.bind(this);

    this.state = {
      card1tapped: false,
      card2tapped: false,
      card3tapped: false,
      card4tapped: false,
      card5tapped: false
    };

    sdk.listenToZone("player1", "zone1", this.player1zone1Listener)
    sdk.listenToZone("player1", "zone2", this.player1zone2Listener)
    sdk.listenToZone("player2", "zone1", this.player2zone1Listener)
    sdk.listenToZone("player2", "zone2", this.player2zone2Listener)
  }

  player1zone1Listener(zoneData) {
    this.setState((state) => {
      return {
        card1tapped: zoneData.card1['state.tapped'],
        card2tapped: zoneData.card2['state.tapped']
      };
    });
  }

  player1zone2Listener(zoneData) {
    this.setState((state) => {
      return {
        card4tapped: zoneData.card4['state.tapped']
      };
    });
  }

  player2zone1Listener(zoneData) {
    this.setState((state) => {
      return {
        card5tapped: zoneData.card5['state.tapped']
      };
    });
  }

  player2zone2Listener(zoneData) {
    this.setState((state) => {
      return {
        card3tapped: zoneData.card3['state.tapped']
      };
    });  
  }

  /*battlefieldListener(zoneData) {
    this.setState((state) => {
      return {
        card1tapped: zoneData.card1['state.tapped'],
        card2tapped: zoneData.card2['state.tapped'],
        card3tapped: zoneData.card3['state.tapped']
      };
    });
  }*/

  getRotationDegrees(isTapped) {
    if (isTapped) {
      return 90;
    }
    else {
      return 0;
    }
  }

  toggleCard1() {
    if (this.state.card1tapped) {
      sdk.untap("card1")
    }
    else {
      sdk.tap("card1")
    }
  }

  toggleCard2() {
    if (this.state.card2tapped) {
      sdk.untap("card2")
    }
    else {
      sdk.tap("card2")
    }
  }

  toggleCard3() {
    if (this.state.card3tapped) {
      sdk.untap("card3")
    }
    else {
      sdk.tap("card3")
    }
  }

  toggleCard4() {
    if (this.state.card4tapped) {
      sdk.untap("card4")
    }
    else {
      sdk.tap("card4")
    }
  }

  toggleCard5() {
    if (this.state.card5tapped) {
      sdk.untap("card5")
    }
    else {
      sdk.tap("card5")
    }
  }

  render() {
    return (
      <div>
        <p>Player 1 Zone 1</p>
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card1tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/d/8/d85892ae-dacd-4a55-a557-9db3c16017c7.jpg?1538881366"} onClick={this.toggleCard1} />
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card2tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/7/f/7f918a49-a046-4115-80b8-13490ed5cd0a.jpg?1538881354"} onClick={this.toggleCard2} />
        
        <p>Player 1 Zone 2</p>
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card4tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/b/d/bdd5a7f0-5ad3-44e8-a103-07739fd53630.jpg?1538881339"} onClick={this.toggleCard4} />
        
        <p>Player 2 Zone 1</p>
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card5tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/b/9/b983acda-68b6-468b-b0c1-aad8b53db49c.jpg?1538881321"} onClick={this.toggleCard5} />
      
        <p>Player 2 Zone 2</p>
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card3tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/2/9/29bfbf3e-3a6c-40d4-8e1b-255f429de6cc.jpg?1538881329"} onClick={this.toggleCard3} />
      </div>
    );
  }
}

export default CardTapExampleZone;
