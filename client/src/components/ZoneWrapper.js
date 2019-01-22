import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, 
    CardSubtitle, CardText, Col, Container, 
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
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
            currentSearchTerm: ""
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState((prevState, props) => (
            {
                modal: !this.state.modal,
                cardlist: prevState.cardlist
            }
        ));
    }

    handleSearch(event) {
        const val = event.target.value;
        
        this.setState((prevState) => (
            {
                modal: prevState.modal,
                currentSearchTerm: val
            }
        ))
    }

    currentVisibleCardList() {
        return this.props.cardlist.filter(
            cardname => cardname.toLowerCase().includes(
                this.state.currentSearchTerm.toLowerCase())
        )
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
                        <Row>
                            <Col>
                                <InputGroup>
                                    <Input placeholder="Card name..." onChange=
                                    {this.handleSearch.bind(this)}/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <h3>{this.props.name}</h3>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        <Container fluid>
                        <Row>
                            <Col className="zone-modal-body"> 
                                <CardList cardlist={this.currentVisibleCardList()} />
                            </Col>
                            <Col xs="5">
                                <Row>
                                    <HighlightedCard />
                                </Row>                            
                                <Row>
                                    <ZoneContextMenu name={this.props.name} />
                                </Row>
                            </Col>
                        </Row>
                        </Container>
                    </ModalBody>
                </Modal>
            </Col>
        )
    }

}

class CardList extends Component {
    render() {
        let renderedList =             
            <ListGroup className="zone-modal-list">
                {this.props.cardlist.map((item) => {
                    return <ListGroupItem>{item}</ListGroupItem>;
                })}
            </ListGroup>;
        return renderedList;
    }
}

class HighlightedCard extends Component {
    render() {
        return <Card>
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
    }
}

class ZoneContextMenu extends Component {
    zoneList = ["Graveyard", "Exile", "Library", "Hand", "Battlefield"];

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    toggle() {
        this.setState( (prevState) => (
                {isOpen: !prevState.isOpen}
            )
        )
    }

    renderContextMenu() {
        return this.zoneList.map(
            (zoneName) => {
                if (!zoneName.match(this.props.name))
                {
                    return <DropdownItem>{zoneName}</DropdownItem>
                }
            }
        )
    }

    render() {
        return <Dropdown isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
            <DropdownToggle caret>
                Move card to...
            </DropdownToggle>
            <DropdownMenu right>
                {this.renderContextMenu()}
            </DropdownMenu>
        </Dropdown>
    }
}

export default ZoneModal;