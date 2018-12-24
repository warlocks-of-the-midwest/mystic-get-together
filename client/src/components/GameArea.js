import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk';

import '../styles/GameArea.css';
import Card from './Card.js';
import Hand from './Hand.js';
import '../styles/Card.css';
import '../styles/Hand.css';

import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
} from 'reactstrap';

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: "Anthony",
      life: 0,
    };

    this.lifeComponent = this.lifeComponent.bind(this);
    this.mainTitle = this.mainTitle.bind(this);
    this.player1Callback = this.player1Callback.bind(this);
    this.player1ZoneCallback = this.player1ZoneCallback.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
    this.addCardToTopBattlefield = this.addCardToTopBattlefield.bind(this);

    sdk.listenToPlayer("player1", this.player1Callback)
    sdk.listenToZone("player1", "zone1", this.player1ZoneCallback)
  }

  player1Callback(docData) {
    const { gameActions } = this.props;
    gameActions.updatePlayer("player1", docData)
  }

  player1ZoneCallback(docData) {
    const { gameActions } = this.props;
    gameActions.updateZone("player1", "zone1", docData)
  }

  toggleCard(card) {
    if (card["state.tapped"]) {
      sdk.untap(card)
    }
    else {
      sdk.tap(card)
    }
  }

  increment(x) {
    this.setState({
      life: Number(this.state.life) + Number(x)
    })
  }

  decrement(x) {
    this.setState({
      life: Number(this.state.life) - Number(x)
    })
  }

  addCardToTopBattlefield(name, cost, img, type, set, text, power, toughness) {
    return (
      <Col
        xs="2"
        style={
          {
            "min-width": "80px",
            "max-height": "50%",
          }
        }
        className="p-0"
      >

        <Card
          name={name}
          cost={cost}
          image={img}
          type={type}
          set={set}
          text={text}
        />

      </Col>
    );
  }

  render() {
    const { gameState } = this.props;
    const { life } = gameState.Players.player1;
    const { card1 } = gameState.Players.player1.Zones.zone1;
    const { card2 } = gameState.Players.player1.Zones.zone1;
    const divStyle = {
      "max-height": '45%',
    };


    return (
      <Container
        fluid
        className="main-container d-flex flex-column mh-100 vh-100 p-0 m-0"
        style={
          {
            "max-height": "100vh"
          }
        }
      >

        <Row
          className="top-nav-row p-0 m-0"
          style={
            {
              "max-height": "9vh",
              "height": "9vh"
            }
          }
        >
          <Col
            xs="12"
            className="p-0 m-0 mh-100 h-100"
          >
            <NavigationBar className="mh-100" life={this.state.life}></NavigationBar>

          </Col>

        </Row>


        <Row
          className="battlefield-sidebar-row p-0 m-0"
          style={
            {
              "max-height": "90vh",
              "height": "90vh"
            }
          }
        >

          {/* Battlefield area. Battlefield is split into two rows. Top and bottom. */}
          <Col
            xs="10"
            className="p-0 m-0 mh-100 h-100 border"
          >
            {/* Top row of battlefield */}
            <Row
              className="battlefield-top-row p-0 m-0 mh-50 h-50"
            >
              {/* Main area for cards */}
              <Col
                className="battlefield-col d-flex flex-wrap justify-content-start flex-shrink-1 mh-100 h-100 px-0"
                style={
                  {
                    // "max-height": ''
                  }
                }
              >
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}
                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}

              </Col>
            </Row>

            {/* Bottom row of cards */}
            <Row
              className="battlefield-bottom-row p-0 m-0 mh-50 h-50"
            >
              <Col
                style={
                  {
                    "overflow": "scroll"
                  }
                }
                className="battlefield-bottom d-inline-flex flex-wrap border justify-content-start card-row card-row-top my-0 mx-0 px-0"
              >

                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}

                {this.addCardToTopBattlefield(
                  "Sonic Assault",
                  "{1}{U}{R}",
                  "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557",
                  "Instant",
                  "https://img.scryfall.com/sets/grn.svg?1545022800",
                  "Card text here"
                )}

              </Col>
            </Row>


          </Col>



          {/* Sidebar area.  */}


          {/* Sidebar for exile,graveyard,hand,library  */}
          <Col
            xs="2"
            className="side-bar-col flex-shrink-3 px-0"
            style={
              {
                "max-height": '100%'
              }
            }
          >
            <Sidebar></Sidebar>
          </Col>

        </Row>

      </Container >
    );
  }

  mainTitle() {
    return (
      <Jumbotron className="d-none d-sm-flex mh-100 pt-0 pb-0 mb-0">
        <div className="mh-100">
          <h6 className="display-5 mh-100">Main Board</h6>
          <p className="d-none d-sm-flex">View of your battlefield.</p>
        </div>
      </Jumbotron>
    );
  }

  lifeComponent() {
    return (
      <Row>
        <Col className="d-inline-flex">
          <h5>Life: </h5> <h5 className="">{this.state.life}</h5>
        </Col>
        <Col xs="12" className="d-inline-flex">
          <ButtonGroup className="d-flex" size="sm">
            <Button outline color="success" onClick={(state) => this.increment(1)} type="submit">
              +1
          </Button>
            <Button outline color="warning" onClick={(state) => this.decrement(1)} type="submit" block>
              -1
          </Button>
          </ButtonGroup>
        </Col>
        <Col className="d-inline-flex">
          <ButtonGroup className="d-flex" size="sm">
            <Button outline color="primary" onClick={(state) => this.increment(5)} type="submit">
              +5
          </Button>
            <Button outline color="danger" onClick={(state) => this.decrement(5)} type="submit" block>
              -5
          </Button>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }
}

GameArea.propTypes = {
  gameState: PropTypes.shape({}).isRequired,
  gameActions: PropTypes.shape({}).isRequired,
};

export default GameArea;