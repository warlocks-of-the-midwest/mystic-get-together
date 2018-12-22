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
  }

  render() {
    return (
      <Container fluid className="sidebar-container mh-100 h-100">
        <Row className="justify-start flex-column sidebar-row mh-100 h-100">
          <Col>
            <Row>
              <Col xs="12" className="border">
                <p className="font-weight-bold text-truncate">Exile</p>
              </Col>
            </Row>
            <Row className="mh-25 h-25">
              <Col xs="12" className="border">
                <p className="font-weight-bold text-truncate">Grave</p>
              </Col>
            </Row>
            <Row className="mh-25 h-25">
              <Col xs="12" className="border">
                <p className="font-weight-bold text-truncate">Hand</p>
              </Col>
            </Row>
            <Row className="mh-25 h-25">
              <Col xs="12" className="border">
                <p className="font-weight-bold text-truncate">Library</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container >
    );
  }
}

export default Sidebar;