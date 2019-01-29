import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'
import ZoneModal from './ZoneWrapper.js';

import '../styles/Sidebar.css';

import {
  Container,
  Row,
  Col
} from 'reactstrap';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let exileList = ["Sonic Assault", "Expansion // Explosion", "Radical Idea"];
    let graveyardList = ["Niv-Mizzet, Parun", "Jori En, Ruin Diver", "Beacon Bolt"];
    return (
      <Container
        fluid
        className="d-flex sidebar-container mh-100 h-100 mw-100 w-100 p-0 m-0"
      >
        
        <Row
          className="justify-start sidebar-row mh-100 h-100 mw-100 w-100 p-0 m-0"
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

          <ZoneModal name="Exile" cardlist={exileList}/>

          <ZoneModal name="Graveyard" cardlist={graveyardList}/>

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