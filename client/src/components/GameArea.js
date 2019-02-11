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

class GameArea extends Component {
  constructor(props) {
    super(props);

    const { cards } = this.props;
    this.state = {
      life: 0,
      cards,
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

  lifeComponent() {
    return (
      <Row>
        <Col className="d-inline-flex">
          <h5>Life: </h5> <h5 className="">{this.state.life}</h5>
        </Col>
        <Col xs="12" className="d-inline-flex">
          <ButtonGroup className="d-flex" size="sm">
            <Button
              outline
              color="success"
              onClick={() => this.increment(1)}
              type="submit"
            >
              +1
            </Button>
            <Button
              outline
              color="warning"
              onClick={() => this.decrement(1)}
              type="submit"
              block
            >
              -1
            </Button>
          </ButtonGroup>
        </Col>
        <Col className="d-inline-flex">
          <ButtonGroup className="d-flex" size="sm">
            <Button
              outline
              color="primary"
              onClick={() => this.increment(5)}
              type="submit"
            >
              +5
            </Button>
            <Button
              outline
              color="danger"
              onClick={() => this.decrement(5)}
              type="submit"
              block
            >
              -5
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }

  render() {
    const { cards, life } = this.state;

    return (
      <Container
        fluid
        className="main-container d-flex flex-column vh-100 mh-100 w-100 p-0 m-0"
      >
        <Row
          className="top-bar-row-wrapper p-0 m-0 d-flex flex-row flex-grow-1 flex-shrink-1"
          style={{
            'flex-basis': '10%',
            overflow: 'auto',
          }}
        >
          <Col
            xs="10"
            className="p-0 m-0"
            style={{
              'flex-basis': '100%',
            }}
          >
            <NavigationBar life={life} active="battlefield" />
          </Col>

          <Col xs="2" className="flex-grow-1 flex-shrink-1">
            <Row>
              <Col className="d-inline-flex mh-100 h-100">
                <p5>Life: </p5> <p5 className="">{life}</p5>
              </Col>
              <Col xs="12" className="d-inline-flex">
                <ButtonGroup className="d-flex" size="sm">
                  <Button
                    outline
                    color="success"
                    onClick={() => this.increment(1)}
                    type="submit"
                  >
                    +1
                  </Button>
                  <Button
                    outline
                    color="warning"
                    onClick={() => this.decrement(1)}
                    type="submit"
                    block
                  >
                    -1
                  </Button>
                </ButtonGroup>
              </Col>
              <Col className="d-inline-flex">
                <ButtonGroup className="d-flex" size="sm">
                  <Button
                    outline
                    color="primary"
                    onClick={() => this.increment(5)}
                    type="submit"
                  >
                    +5
                  </Button>
                  <Button
                    outline
                    color="danger"
                    onClick={() => this.decrement(5)}
                    type="submit"
                    block
                  >
                    -5
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row
          className="cards-sidebar-row-wrapper flex-row flex-grow-5 flex-shrink-1 p-0 m-0"
          style={{
            'flex-basis': '90%',
          }}
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
              <Row className="top-cards-row mh-50 h-50 mw-100 w-100 p-0 m-0 border">
                {/* Main area for cards */}
                <Col
                  xs="12"
                  className="top-cards-row-col d-flex flex-wrap justify-content-start flex-shrink-1 mh-100 h-100 mw-100 w-100 p-0 m-0"
                >
                  <>

                    {_.map(cards, (card) => (
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
          </Col>
          {/* Sidebar for exile,graveyard,hand,library  */}
          <Col xs="2" className="sidebar-col p-0 m-0">
            <Container
              fluid
              className="sidebar-col-container mh-100 h-100 mw-100 w-100 p-0 m-0"
            >
              <Row className="sidebar-col-container-row mh-100 h-100 mw-100 w-100 p-0 m-0">
                <Col className="side-bar-col-container-row-col w-100 mw-100 flex-shrink-3 p-0 m-0">
                  <Sidebar />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

GameArea.propTypes = {
  cards: PropTypes.array.isRequired,
};

export default GameArea;
