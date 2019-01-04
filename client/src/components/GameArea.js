import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk';

import '../styles/GameArea.css';
import Card from './Card.js';
import '../styles/Card.css';

import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Popover,
  UncontrolledPopover,
} from 'reactstrap';
import Axios from 'axios';

class GameArea extends Component {
  url = 'https://api.scryfall.com/cards/1d9d8732-9ff2-42e4-bdfc-723cb6a76969?format=json';

  constructor(props) {
    super(props);
    this.state = {
      player: "Anthony",
      life: 0,
      top_row: [],
      bottom_row: [],
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
        xs="1"
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

  async t() {
    const getcard = () => {
      const responsePromise = async () => {
        try {
          const response = await Axios.get(this.url)
          console.log("axios response should be returned: " + response.data);
          this.setState((state) => {
            var arr = state.top_row.slice();
            arr.push(response.data);
            return { top_row: arr }
          })
          console.log("this.state.top_row " + this.state.top_row.length);
          return responsePromise.data;
        }
        catch (e) {
          console.log(e);
          return e;
        }
        finally {
          console.log("returning from axios fetch card try");
        }
      }
      console.log("call async function to fetch card info from scryfall");
      responsePromise();
    }
    return await getcard();
  }

  componentDidMount() {
    this.u("url");
    // this.forceUpdate();
  }

  async u(url) {
    const cardInfo = await Card.getScryFallCardInfo(url);
    this.setState((state) => {
      var arr = state.top_row.slice();
      arr.push(cardInfo);
      return {
        top_row: arr
      };
    });
  }

  getScryfallCards() {
    var arr = this.state.top_row.map((cardInfo) => {
      return (
        <Col
          xs="1"
          style={
            {
              "min-width": "80px",
              "max-height": "50%",
            }
          }
          className="p-0">
          <Card
            name={this.state.top_row[0][0]}
            cost={this.state.top_row[0][1]}
            image={this.state.top_row[0][2]}
            type={this.state.top_row[0][3]}
            set={this.state.top_row[0][4]}
            text={this.state.top_row[0][5]}
            power={this.state.top_row[0][6]}
            divider={this.state.top_row[0][6] ? "/" : ""}
            toughness={this.state.top_row[0][7]}
          >
          </Card >
        </Col>
      );
    });
    return arr;
  }

  render() {

    return (
      <Container
        fluid
        className="main-container d-flex vh-100 w-100 p-0 m-0"
      >

        <Row
          className="main-row p-0 m-0 d-flex flex-row flex-grow-1 flex-shrink-1"
        >
          <Col
            xs="12"
            className="p-0 m-0"
            style={
              {
                "flex-basis": "100%",
              }
            }
          >
            <NavigationBar
              life={this.state.life}
              active="battlefield"
            >
            </NavigationBar>

          </Col>

          <Col
            xs="12"
            className="battlefield-sidebar-col p-0 m-0 w-100 flex-grow-1 flex-shrink-1"
            style={
              {
                "flex-basis": "90%",
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
                style={
                  {
                    "overflow-y": "scroll",
                    "overflow-x": "hidden"
                  }
                }
              >
                {/* Main area for cards */}
                <Col
                  className="battlefield-col d-flex flex-wrap justify-content-start flex-shrink-1 mh-100 h-100 px-0"
                >


                  {console.log(this.state.top_row)}
                  <>
                    {
                      this.state.top_row.map((cardInfo) => {
                        console.log("inmapping")
                        console.log(cardInfo);
                        return (
                          <Col
                            xs="1"
                            style={
                              {
                                "min-width": "80px",
                                "max-height": "50%",
                              }
                            }
                            className="p-0">
                            <Card
                              name={cardInfo[0]}
                              cost={cardInfo[1]}
                              image={cardInfo[2]}
                              type={cardInfo[3]}
                              set={cardInfo[4]}
                              text={cardInfo[5]}
                              power={cardInfo[6]}
                              divider={cardInfo[6] ? "/" : ""}
                              toughness={cardInfo[7]}
                            >
                            </Card >
                          </Col>
                        );
                      })
                    }
                  </>

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
                style={
                  {
                    "overflow": "auto"
                  }
                }
              >
                <Col

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

            {/* Sidebar for exile,graveyard,hand,library  */}
            <Col
              xs="2"
              className="side-bar-col flex-shrink-3 px-0"
              style={
                {
                  "flex-basis": "10%",
                }
              }
            >
              <Sidebar></Sidebar>
            </Col>
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