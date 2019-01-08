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
  lordyUrl = 'https://api.scryfall.com/cards/1d9d8732-9ff2-42e4-bdfc-723cb6a76969?format=json';

  constructor(props) {
    super(props);
    this.state = {
      player: "Anthony",
      life: 0,
      top_row: [],
      bottom_row: [],
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.addCardToTopBattlefield = this.addCardToTopBattlefield.bind(this);
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

  componentDidMount() {
    this.fetchCard(this.lordyUrl);
    this.fetchCard("https://api.scryfall.com/cards/cc61a398-cf16-415b-b3cf-897217dc7cc9?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/e16e4f85-9611-4d5f-a7d9-4a5961dd7182?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/54a0afaa-f99f-4c7a-9fa1-c6a46dfb2a29?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/086a0591-718f-4a33-a5f5-e9265468c3ad?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/3ed39bd7-d059-4a44-9f03-0f628dcdb119?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/b0e0ef27-3db2-4976-b9db-13e3d7cd795d?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/544a06f8-75fe-41b6-81dc-c9a0358f03c5?format=json&pretty=true");
    this.fetchCard("https://api.scryfall.com/cards/06750380-a9a9-4ab4-a03b-d4d35a31132a?format=json&pretty=true");
  }

  // Fetch a card given it's scryfall api url.
  async fetchCard(url) {
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
          className="p-0"
        >
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
        className="main-container d-flex flex-column vh-100 mh-100 w-100 p-0 m-0"
      >
        <Row
          className="top-bar-row-wrapper p-0 m-0 d-flex flex-row flex-grow-1 flex-shrink-1"
          style={
            {
              "flex-basis": "10%"
            }
          }
        >
          <Col
            xs="10"
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
            xs="2"
            className="flex-grow-1 flex-shrink-1"
          >
            <Row>
              <Col className="d-inline-flex mh-100 h-100">
                <p5>Life: </p5> <p5 className="">{this.state.life}</p5>
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
          </Col>
        </Row>


        <Row
          className="cards-sidebar-row-wrapper flex-row flex-grow-5 flex-shrink-1 p-0 m-0"
          style={
            {
              "flex-basis": "90%"
            }
          }
        >
          <Col
            xs="10"
            className="battlefield-col p-0 m-0 flex-grow-1 flex-shrink-1 flex-wrap"
          >
            {/* Battlefield area. Battlefield is split into two rows. Top and bottom. */}
            <Container
              fluid
              className="cards-rows-container mh-100 h-100 p-0 m-0"
            >
              {/* Top row of battlefield */}
              <Row
                className="top-cards-row mh-50 h-50 mw-100 w-100 p-0 m-0 border"
              >
                {/* Main area for cards */}
                <Col
                  xs="12"
                  className="top-cards-row-col d-flex flex-wrap justify-content-start flex-shrink-1 mh-100 h-100 mw-100 w-100 p-0 m-0"
                >
                  <>
                    {
                      this.state.top_row.map((cardInfo) => {
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

                </Col>
              </Row>

              {/* Bottom row of cards */}
              <Row
                className="bottom-cards-row mh-50 h-50 mw-100 w-100 p-0 m-0 border"
              >
                <Col
                  xs="12"
                  className="battlefield-bottom d-inline-flex flex-wrap justify-content-start card-row card-row-top m-0 p-0"
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
            </Container>
          </Col>

          {/* Sidebar for exile,graveyard,hand,library  */}
          <Col
            xs="2"
            className="sidebar-col p-0 m-0"
          >
            <Container
              fluid
              className="sidebar-col-container mh-100 h-100 mw-100 w-100 p-0 m-0"
            >
              <Row
                className="sidebar-col-container-row mh-100 h-100 mw-100 w-100 p-0 m-0"
              >
                <Col
                  className="side-bar-col-container-row-col w-100 mw-100 flex-shrink-3 p-0 m-0"
                >
                  <Sidebar></Sidebar>
                </Col>
              </Row>
            </Container>
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