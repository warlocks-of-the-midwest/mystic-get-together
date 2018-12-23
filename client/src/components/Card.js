import React, { Component } from 'react';
import '../styles/Card.css';
import {
  Jumbotron,
  Container,
  Row,
  Col,
} from 'reactstrap';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container fluid xs="12" className="card-container mh-100 h-100 mw-50 border rounded p-0 m-0">
        <Row className="card-main-row mh-100 mw-50 px-3">

          {/* Card name and mana cost row */}
          <Col xs="12" className="cardname-manacost-col d-inline-flex px-1 flex-grow-2 flex-shrink-1 justify-content-between" style={{ "max-height": "10%" }}>
            
            {/* Card name */}
            <Col className="name-col px-0 flex-shrink-1 flex-grow-5 justify-content-start">
              <p style={{ "font-size": "50%", "text-overflow": "hidden" }} className="text-left text-nowrap">{this.props.name}</p>
            </Col>

            {/* Mana cost */}
            <Col className="mana-cost-col px-0 flex-shrink-3 flex-grow-1 justify-content-end">
              <p style={{ "font-size": "40%", "text-overflow": "hidden" }} className="text-right text-nowrap font-weight-light">{this.props.cost}</p>
            </Col>
          </Col>

          {/* Image row */}
          <Col xs="12" className="card-image-col px-1 mx-auto" style={{ "max-width": "20vmin", "max-height": "40%" }}>
            <img
              className="card-art-image img-fluid d-block"
              style={{ "max-height": "100%" }}
              alt="Card Art"
              src={this.props.image}
            />
          </Col>

          {/* Row for type and set logo */}
          <Col xs="12" className="type-set-col d-inline-flex px-1 pb-1 flex-shrink-3 flex-grow-1 justify-content-between" style={{ "max-height": "3vmin", "height": "3vmin" }}>
          
            {/* Card type */}
            <Col className="card-type-col d-flex px-0 flex-shrink-1 text-left">
              <p style={{ "font-size": "40%", "text-overflow": "hidden" }} className="mb-0 text-left text-nowrap font-weight-light">{this.props.type}</p>
            </Col>

            {/* Card set image */}
            <Col className="card-set-image-col d-flex px-0 py-0 flex-shrink-2 clearfix" style={{ "max-height": "100%" }}>
              <img
                className="set-image img-fluid mh-100 float-right ml-auto align-top"
                alt="Set Image"
                src={this.props.set}
              />
            </Col>
          </Col>

          {/* Card text */}
          <Col xs="12" className="card-text-row px-1 d-flex flex-shrink-1 flex-grow-4" style={{ "max-height": "5vmin", "min-height": "5vmin" }}>
            <p className="text-left text-nowrap" style={{ "font-size": "50%", "text-overflow": "hidden" }}>{this.props.text}</p>
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