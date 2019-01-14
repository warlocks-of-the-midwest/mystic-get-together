import React, { Component } from 'react';
import '../styles/Card.css';
import {
  Jumbotron,
  Container,
  Row,
  Col,
  Media
} from 'reactstrap';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container
        fluid
        className="card-container d-flex flex-column mh-100 h-100 mw-50 border rounded p-0 m-0"
      >


        {/* Card name and mana cost row */}
        <Row
          className="card-name-cost-row d-inline-flex no-gutters px-1 justify-content-between flex-grow-5 flex-shrink-1"
          style={
            {
              "max-height": "15%"
            }
          }
        >
          {/* Card name */}
          <Col
            className="card-name-col px-0 flex-shrink-1 flex-grow-5 justify-content-start"
          >
            <p
              style={
                {
                  "font-size": ".4rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-name text-left text-nowrap mb-0 font-weight-bold"
            >
              {this.props.name}
            </p>
          </Col>

          {/* Mana cost */}
          <Col
            className="card-mana-cost-col px-0 flex-shrink-3 flex-grow-1 justify-content-end">
            <p
              style={
                {
                  "font-size": ".375rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-cost text-right text-nowrap mb-0"
            >
              {this.props.cost}
            </p>
          </Col>
        </Row>


        {/* Image row with a col wrapper to control size of image */}
        <Row
          className="card-art-row justify-content-center mw-100 w-100 m-0 px-1 flex-grow-10 flex-shrink-1"
          style={
            {
              "max-height": "50%"
            }
          }
        >
          <Col
            xs="12"
            className="card-art-col p-0 mh-100"
          >
              <Media
                obj
                className="card-art-image img-fluid d-block mx-auto mh-100"
                alt="Card Art"
                src={this.props.image}
              />

          </Col>
        </Row>


        {/* Row for type and set logo */}
        <Row
          className="card-type-set-row justify-content-between px-1 m-0 flex-grow-1 flex-shrink-10"
          style={
            {
              "max-height": "10%"
            }
          }
        >
          {/* Card type */}
          <Col
            className="card-type-col d-flex px-0 text-left">
            <p
              style={
                {
                  "font-size": ".375rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-type mb-0 text-left text-nowrap"
            >
              {this.props.type}
            </p>
          </Col>

          {/* Card set image */}
          <Media
            className="card-set-image-col d-flex px-0 py-0 flex-shrink-2 clearfix"
            style={
              {
                "max-height": "100%",
                "height": "100%",
                "overflow": "hidden"
              }
            }
          >

            <Media
              obj
              style={
                {
                  "max-height": "100%",
                  "min-height": "1vmin",
                }
              }
              className="set-image img-fluid mh-100 float-right ml-auto align-top"
              alt="Set Image"
              src={this.props.set}
            />

          </Media>
        </Row>


        {/* Card text */}
        <Row
          className="card-text-row px-1 m-0 flex-grow-5 flex-shrink-1"
        >
          <Col
            xs="12"
            className="card-text-col d-flex flex-shrink-1 flex-grow-4 p-0"
          >
            <p
              className="card-text text-left text-nowrap mb-0"
              style={
                {
                  "font-size": ".4rem",
                  "text-overflow": "hidden"
                }
              }
            >
              {this.props.text}
            </p>
          </Col>
        </Row>


        {/* Power and toughness if creature */}
        <Row
          className="card-power-toughness-row m-0 px-1 flex-grow-5 flex-shrink-3"
          style={
            {
              "max-height": "15%"
            }
          }
        >
          <Col
            xs="12"
            className="card-power-toughness-col px-1 d-flex flex-shrink-1 flex-grow-2"
            style={
              {
                "max-height": "2vh"
              }
            }
          >
            <p
              className="card-power-toughness text-right text-nowrap"
              style={
                {
                  "font-size": "45%",
                  "text-overflow": "hidden"
                }
              }
            >
              {/* Don't forget to add the divider when inputting power and toughness */}
              {this.props.power}{this.props.divider}{this.props.toughness}
            </p>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default Card;