import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as sdk from '../js-sdk/sdk'
import SideZone from './SideZone.js';

import '../styles/Sidebar.css';

import {
  Container,
  Row,
  Col
} from 'reactstrap';

  const exileList = [
    "https://api.scryfall.com/cards/5d9aa740-9adf-412a-b6ec-0b9bb1b4618b",
    "https://api.scryfall.com/cards/a4ee56f1-9f08-459f-8517-0fe7bc645fa3",
    "https://api.scryfall.com/cards/2b7472f4-37b0-439f-b4ac-80706d40d191"
  ];
  const graveyardList = [ 
    "https://api.scryfall.com/cards/fcdbb062-0b0b-4b4c-b4db-dd149f744baa",
    "https://api.scryfall.com/cards/73db9c10-109a-417f-81cd-489d9510cc78",
    "https://api.scryfall.com/cards/f40284e6-01a1-4372-a92c-940e5732607e"
  ];

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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

          <SideZone name="Exile" cardlist={exileList}/>

          <SideZone name="Graveyard" cardlist={graveyardList}/>

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