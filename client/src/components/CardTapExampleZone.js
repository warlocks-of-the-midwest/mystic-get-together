import React, { Component } from 'react';
import * as sdk from '../js-sdk/sdk'

class CardTapExampleZone extends Component {
  constructor(props) {
    super(props);
    this.toggleCard1 = this.toggleCard1.bind(this);
    this.toggleCard2 = this.toggleCard2.bind(this);
    this.toggleCard3 = this.toggleCard3.bind(this);
    this.battlefieldListener = this.battlefieldListener.bind(this);

    this.state = {
      card1tapped: false,
      card2tapped: false,
      card3tapped: false
    };

    sdk.listenToZone("zone1", this.battlefieldListener)
  }

  battlefieldListener(zoneData) {
    this.setState((state) => {
      return {
        card1tapped: zoneData.card1['state.tapped'],
        card2tapped: zoneData.card2['state.tapped'],
        card3tapped: zoneData.card3['state.tapped']
      };
    });
  }

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

  render() {
    return (
      <div>
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card1tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/d/8/d85892ae-dacd-4a55-a557-9db3c16017c7.jpg?1538881366"} onClick={this.toggleCard1} />
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card2tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/7/f/7f918a49-a046-4115-80b8-13490ed5cd0a.jpg?1538881354"} onClick={this.toggleCard2} />
        <img style={{ transform: `rotate(${this.getRotationDegrees(this.state.card3tapped)}deg)` }}
          src={"https://img.scryfall.com/cards/small/front/b/d/bdd5a7f0-5ad3-44e8-a103-07739fd53630.jpg?1538881339"} onClick={this.toggleCard3} />
      </div>
    );
  }
}

export default CardTapExampleZone;
