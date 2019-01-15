import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, 
    CardSubtitle, CardText, Col, Container, 
    ListGroup, ListGroupItem,
    Row, Input, InputGroup, Modal, 
    ModalHeader, ModalBody } from 'reactstrap';
//import Card from './Card.js'
import '../styles/Zones.css'

const dummyImg = "https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557";
const dummySymbol = "https://img.scryfall.com/sets/grn.svg?1545022800"
const dummyCost = "{1}{U}{R}"
const dummyText = "Jump-Start \n Tap a target creature. Sonic Assault deals 2 damage to that creature's controller"

class ZoneModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            cardlist: this.props.cardlist
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <Col xs="12" className="border p-1" onClick={this.toggle}>
                <h6 className="font-weight-bold text-wrap" 
                    style={{ "font-size": "50%" }}>
                    {this.props.name}
                </h6>
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                    centered={true} size="lg">
                    <ModalHeader toggle={this.toggle}>
                        <InputGroup>
                            <Input placeholder="Card name..."/>
                        </InputGroup>
                    </ModalHeader>
                    <ModalBody>
                        <Container fluid>
                        <Row>
                            <Col className="zone-modal-body"> 
                                <ListGroup className="zone-modal-list">
                                    <ListGroupItem>Sonic Assault</ListGroupItem>
                                    <ListGroupItem>Ravenous Chupucabra</ListGroupItem>
                                    <ListGroupItem>Niv-Mizzet, Parun</ListGroupItem>
                                    <ListGroupItem>Beacon Bolt</ListGroupItem>
                                    <ListGroupItem>Storm the Vault</ListGroupItem>
                                    <ListGroupItem>Jori En, Ruin Diver</ListGroupItem>
                                    <ListGroupItem>Izzet Charm</ListGroupItem>
                                    <ListGroupItem>Think Twice</ListGroupItem>
                                    <ListGroupItem>Star of Extinction</ListGroupItem>
                                    <ListGroupItem>Chaos Warp</ListGroupItem>
                                    <ListGroupItem>Search for Azcanta</ListGroupItem>
                                    <ListGroupItem>Zacama, Primal Calamity</ListGroupItem>
                                    <ListGroupItem>Josu Vess, Lich Knight</ListGroupItem>
                                    <ListGroupItem>Teferi, Hero of Dominaria</ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col xs="5">
                                <Card>
                                    <CardBody fluid id="card-top">
                                        <Row>
                                        <Col>Sonic Assault</Col>
                                        <Col>{dummyCost}</Col>
                                        </Row>
                                    </CardBody>
                                    <CardImg top fluid src={dummyImg}/>
                                    <CardBody>
                                        <CardSubtitle>Instant</CardSubtitle>
                                        <CardText>{dummyText}</CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        </Container>
                    </ModalBody>
                </Modal>
            </Col>
        )
    }
}

export default ZoneModal;