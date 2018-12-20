import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'

import '../styles/Sidebar.css';

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

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      life: 0,
      name: "Anthony"
    }

    this.increment = this.increment.bind(this);
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
    return (
      <Container fluid>
        <Row>
          <Col xs="12" className="border">
            <Col xs="12">
              <h3>Life:</h3> <h4>{this.state.life}</h4>
            </Col>
            <Col xs="4">
              <ButtonGroup size="sm">
                <Button
                  block
                  outline
                  color="success"
                  onClick={(state) => this.increment(1)} type="submit">Up</Button>
                <Button
                  block
                  outline
                  color="warning"
                  onClick={(state) => this.decrement(1)} type="submit">Down</Button>
              </ButtonGroup>
              <ButtonGroup size="sm">
                <Button
                  block
                  outline
                  color="primary"
                  onClick={(state) => this.increment(5)} type="submit">+5</Button>
                <Button
                  block
                  outline
                  color="danger"
                  onClick={(state) => this.decrement(5)} type="submit">-5</Button>
              </ButtonGroup>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="border">
            <h3>Exile</h3>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="border">
            <h3>Grave</h3>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="border">
            <h3>Hand</h3>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="border">
            <h3>Library</h3>
          </Col>
        </Row>
      </Container>

    );
  }
}

export default Sidebar;