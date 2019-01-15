import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'
import ZoneModal from './ZoneWrapper.js';

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
      <Container
        fluid
        className="sidebar-container mh-100 h-100 mw-100 w-100"
      >
        
        <Row
          className="justify-start sidebar-row mh-100 h-100"
        >

          {/* Hand */}
          <Col
            xs="12"
            className="border p-1"
          >
            
            <h6
              className="font-weight-bold text-wrap"
              style={
                {
                  "font-size": "50%"
                }
              }
            >
              Hand
            </h6>

          </Col>

          <ZoneModal name="Exile" cardlist=""/>

          <ZoneModal name="Graveyard" cardlist=""/>

          {/* Library */}
          <Col
            xs="12"
            className="border p-1"
          >
            
            <h6
              className="font-weight-bold text-wrap"
              style={
                {
                  "font-size": "50%"
                }
              }
            >
              Library
            </h6>

          </Col>


        </Row>

      </Container >
    );
  }
}

export default Sidebar;