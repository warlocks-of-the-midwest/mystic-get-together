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
      <Container fluid xs="12" className="card-container mh-100 h-100 mw-50 border rounded p-0 m-0">
        <Row className="card-main-row mh-100 mw-50 no-gutters px-1">

          {/* Card name and mana cost row */}
          <Col xs="12" className="cardname-manacost-col d-inline-flex flex-grow-2 flex-shrink-1 justify-content-between" style={{ "max-height": "10%" }}>

            {/* Card name */}
            <Col className="name-cols px-0 flex-shrink-1 flex-grow-5 justify-content-start">
              <p
                style={
                  {
                    "font-size": "40%",
                    "text-overflow": "hidden"
                  }
                }
                className="text-left text-nowrap mb-0"
              >
                {this.props.name}
              </p>
            </Col>

            {/* Mana cost */}
            <Col
              className="mana-cost-col px-0 flex-shrink-3 flex-grow-1 justify-content-end">
              <p
                style={
                  {
                    "font-size": "35%", "text-overflow": "hidden"
                  }
                }
                className="text-right text-nowrap font-weight-light mb-0"
              >
                {this.props.cost}
              </p>
            </Col>
          </Col>

          {/* Image row with a col wrapper to control size */}
          <Col
            xs="12"
            className="car-image-col-wrapper px-md-2 px-lg-5"
          >
            <Col
              xs="12"
              className="card-image-col mx-auto"
              style={
                {
                  // "max-width": "20vmin",
                  // "max-height": "100%"
                }
              }
            >
              <Media>
                <Media
                  obj
                  className="card-art-image img-fluid d-block"
                  style={{ "max-height": "100%" }}
                  alt="Card Art"
                  src={this.props.image}
                />

              </Media>

            </Col>

          </Col>

          {/* Row for type and set logo */}
          <Col
            xs="12"
            className="type-set-col d-inline-flex flex-shrink-3 flex-grow-1 justify-content-between"
            style={
              {
                // "max-height": "3%", "height": "3%"
              }
            }
          >

            {/* Card type */}
            <Col
              className="card-type-col d-flex px-0 flex-shrink-1 text-left">
              <p style={
                {
                  "font-size": "35%",
                  "text-overflow": "hidden"
                }
              }
                className="mb-0 text-left text-nowrap font-weight-light"
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
                }
              }
            >

              <Media
                obj
                style={
                  {
                    "max-height": "100%",
                    "min-height": "3px",
                  }
                }
                className="set-image img-fluid mh-100 float-right ml-auto align-top"
                alt="Set Image"
                src={this.props.set}
              />

            </Media>
          </Col>

          {/* Card text */}
          <Col
            xs="12"
            className="card-text-row px-1 d-flex flex-shrink-1 flex-grow-4"
            style={
              {
                // "max-height": "5%", "min-height": "5%"
              }
            }
          >
            <p
              className="text-left text-nowrap mb-0"
              style={
                {
                  "font-size": "40%", "text-overflow": "hidden"
                }
              }
            >
              {this.props.text}
            </p>
          </Col>

          {/* Power and toughness if creature */}
          <Col xs="12" className="card-power-toughness px-1 d-flex flex-shrink-1 flex-grow-2" style={{ "max-height": "10%" }}>
            <p className="text-right text-nowrap" style={{ "font-size": "40%", "text-overflow": "hidden" }}>{this.props.power}{this.props.divider}{this.props.toughness}</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Card;