import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'

import Child from './Child';
import CardChild from './CardChild';

import '../styles/GameArea.css';

import Card from './Card';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: "Anthony",
      life: 0,
    }

    this.player1Callback = this.player1Callback.bind(this);
    this.player1ZoneCallback = this.player1ZoneCallback.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.toggleCard = this.toggleCard.bind(this);

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

  render() {
    const { gameState } = this.props;
    const { life } = gameState.Players.player1;
    const { card1 } = gameState.Players.player1.Zones.zone1;
    const { card2 } = gameState.Players.player1.Zones.zone1;

    return (
      <Container fluid className="main-container">
        <Row className="main-row d-flex mh-100 h-100">
          <Col xs="12" className="top-row-wrapper d-flex">
            <Row className="top-row d-flex justify-content-between mh-100 h-100 mw-100 w-100">
              <Col xs="2" className="nb-col mh-100 h-100">
                <NavigationBar></NavigationBar>
              </Col>
              <Col xs="8" className=" mh-100 h-100">
                <Jumbotron className="d-none d-sm-flex mh-100 pt-0 pb-0 mb-0">
                  <div>
                    <h1 className="display-5">Main Board</h1>
                    <p className="lead">View of your battlefield.</p>
                  </div>
                </Jumbotron>
              </Col>
              <Col xs="2">
                <Row>
                  <Col className="d-inline-flex justify-content-between">
                    <h5>Life: </h5> <h5 className="">{this.state.life}</h5>
                  </Col>
                </Row>
                <Row>
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
                </Row>
                <Row>
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
          </Col>
          <Col xs="10" className="battlefield-area">
            <Row>
              <Col xs="12" className="justify-content-start card-row card-row-top mh-100 mw-50 mb-1">
                <Card
                  name="Sonic Assault"
                  cost="{1}{U}{R}"
                  image="https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557"
                  type="Instant"
                  set="https://img.scryfall.com/sets/grn.svg?1545022800"
                  text="Card text here">
                </Card>
              </Col>
              <Col xs="12" className="card-row card-row-bottom mh-100 mw-50 mb-1">
                <Card
                  name="Sonic Assault"
                  cost="{1}{U}{R}"
                  image="https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557"
                  type="Instant"
                  set="https://img.scryfall.com/sets/grn.svg?1545022800"
                  text="Card text here">
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs="2" className="mh-100 h-100">
            <Sidebar></Sidebar>
          </Col>
        </Row>
      </Container >
    );
  }
}

GameArea.propTypes = {
  gameState: PropTypes.shape({}).isRequired,
  gameActions: PropTypes.shape({}).isRequired,
};

export default GameArea;
