import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
} from 'reactstrap';

import Card from './Card.js';

import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

import '../styles/GameArea.css';
import '../styles/Card.css';
import { Zones } from '../constants.js';

class Battlefield extends Component {
  constructor(props) {
    super(props);

    const { cards } = this.props;
    this.state = {
      life: 0,
      cards,
      top_row: [],
      bottom_row: [],
      isToggleSidebarOn: false,
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cards } = nextProps;
    this.setState({
      cards,
    });
  }

  increment(x) {
    this.setState({
      life: Number(this.state.life) + Number(x),
    });
  }

  decrement(x) {
    this.setState({
      life: Number(this.state.life) - Number(x),
    });
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

  handleToggleSidebarClick() {
    this.setState({
      isToggleSidebarOn: !this.state.isToggleSidebarOn,
    });
  }

  render() {
    const { cards, life, isToggleSidebarOn } = this.state;
    const FULL_LENGTH = 12;
    const SHORTER_LENGTH = 10;
    const battfieldFieldColumnLength = isToggleSidebarOn ? FULL_LENGTH : SHORTER_LENGTH;

    return (
            <Container
              fluid
              className="cards-rows-container mh-100 h-100 p-0 m-0"
            >
              {/* Top row of battlefield */}
              <Row className="top-cards-row mh-50 h-50 mw-100 w-100 p-0 m-0 border">
                {/* Main area for cards */}
                <Col
                  xs="12"
                  className="top-cards-row-col d-flex flex-wrap justify-content-start flex-shrink-1 mh-100 h-100 mw-100 w-100 p-0 m-0"
                >
                  <>

                    {cards
                      .filter((card) => _.get(card, 'state.zone') === Zones.BATTLEFIELD)
                      .map((card) => (
                        <Col
                          xs="2"
                          style={{
                            'min-width': '80px',
                            'max-height': '50%',
                          }}
                          className="no-gutters"
                        >
                          <Col
                            xs="11"
                            className="mh-100 h-100 no-gutters"
                          >
                            <Card card={card} />
                          </Col>
                          <Col
                            xs="1"
                            className="mh-100 h-100 no-gutters"
                          />
                        </Col>
                      ))}
                  </>
                </Col>
              </Row>

              {/* Bottom row of cards */}
              <Row className="bottom-cards-row mh-50 h-50 mw-100 w-100 p-0 m-0 border">
                <Col
                  xs="12"
                  className="battlefield-bottom d-inline-flex flex-wrap justify-content-start card-row card-row-top m-0 p-0"
                >
                  {'placeholder text - bottom row'}
                </Col>
              </Row>
            </Container>
    );
  }
}

Battlefield.propTypes = {
  cards: PropTypes.array.isRequired,
};

export default Battlefield;
