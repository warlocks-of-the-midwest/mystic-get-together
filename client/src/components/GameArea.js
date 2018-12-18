import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'

import Child from './Child';
import CardChild from './CardChild';

import '../styles/GameArea.css';

import Card from './Card';
import { Jumbotron,
	Container,
	Row,
	Col,
	Button,
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
  DropdownItem } from 'reactstrap';

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.player1Callback = this.player1Callback.bind(this);
    this.player1ZoneCallback = this.player1ZoneCallback.bind(this);
    this.increment = this.increment.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
    this.toggle = this.toggle.bind(this);
    
    this.state = {
      isOpen: false
    };

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

  increment(newLife) {
    sdk.updateLife("player1", newLife)
  }

  toggleCard(card) {
    if (card["state.tapped"]) {
      sdk.untap(card)
    }
    else {
      sdk.tap(card)
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { gameState } = this.props;
    const { life } = gameState.Players.player1;
    const { card1 } = gameState.Players.player1.Zones.zone1;
    const { card2 } = gameState.Players.player1.Zones.zone1;

    return (
      <Container fluid>
        <Row>
          <Col xs="2">
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/">Menu</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink href="/components/">Components</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
										<DropdownToggle nav caret>
											Options
										</DropdownToggle>
										<DropdownMenu right>
                      <DropdownItem>
                        Anthony
											</DropdownItem>
                      <DropdownItem>
												Option 1
											</DropdownItem>
											<DropdownItem>
												Option 2
											</DropdownItem>
											<DropdownItem divider />
											<DropdownItem>
												Reset
											</DropdownItem>
										</DropdownMenu>
									</UncontrolledDropdown>
								</Nav>
							</Collapse>
						</Navbar>
          </Col>
          <Col xs="8">
            <div className="game-area">
              <div className="board"> 
                <Jumbotron>
                  <Container>
                    <h1 className="display-3">Main Board</h1>
                    <p className="lead">View of your battlefield.</p>
                  </Container>
                </Jumbotron>
                <Child life={life} />
                <CardChild card={card1} />
                <button onClick={ () => this.toggleCard(card1)} type="submit">Click</button>
                <CardChild card={card2} />
                <button onClick={ () => this.toggleCard(card2)} type="submit">Click</button>
                <Card 
                  name="Sonic Assault"
                  cost="{1}{U}{R}"
                  image="https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557"
                  type="Instant"
                  set="https://api.scryfall.com/sets/grn"
                  text="Card text here">
                </Card>
              </div>
            </div>
          </Col>
          <Col xs="2">
            <div className="side-area">
              <div className="temp">Life: {life} <button onClick={ () => this.increment((Math.floor(Math.random() * 100)))} type="submit">Click</button></div>
              <div className="temp">Exile</div>
              <div className="temp">Grave</div>
              <div className="temp">Hand</div>
              <div className="temp">Library</div>
            </div>
          </Col>
        </Row>
    </Container>
    );
  }
}

GameArea.propTypes = {
  gameState: PropTypes.shape({}).isRequired,
  gameActions: PropTypes.shape({}).isRequired,
};

export default GameArea;
