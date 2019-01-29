import React, { Component } from 'react';
import Card from './Card.js'
import  {   Col, Row, Container, 
            Modal, ModalHeader, ModalBody,
            Input, InputGroup, 
            ListGroup, ListGroupItem,
            Dropdown, DropdownItem, DropdownMenu, DropdownToggle
        } from 'reactstrap';
import '../styles/Zones.css'

class SideZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            cardList: [],
            currentSearchTerm: "",
            currentCard: 0
        };

        this.loadCardList()
        this.toggle = this.toggle.bind(this);
    }

    /**  
     * Fetches the cardInfo objects associated with the urls in props.cardlist
     * and stores them in this.state. This is only done once.
     */
    loadCardList() {
        Promise.all(this.props.cardlist.map((cardUrl) => (
            Card.getScryFallCardInfo(cardUrl)
        ))).then((results) => (
            this.setState(function() { return {cardList: results }})
        ))
    }

    /**
     * Toggles the modal state. Also resets this.state.currentSearchTerm.
     */
    toggle() {
        this.setState((prevState, props) => (
            {
                modal: !prevState.modal,
                currentSearchTerm: ""
            }
        ));
    }

    /**
     * Handles onChange events for the modal's searchbar.
     * @param {e} event 
     */
    handleSearch(event) {
        const val = event.target.value;
        
        this.setState((prevState) => (
            { 
                modal: prevState.modal, 
                currentSearchTerm: val 
            }
        ))
    }

    /**
     * Returns a list containing the card names of all cards in 
     * this.state.cardList that match this.state.currentSearchTerm.
     */
    currentVisibleCardList() {
        if (this.state.cardList != null) {
            return this.state.cardList.map((cardInfo) => (
                cardInfo[0]
            )).filter((cardname) => (
                cardname.toLowerCase().includes(
                    this.state.currentSearchTerm.toLowerCase()
                )
            ))
        }
        return null;
    }

    render() {
        return (
            <Col xs="12" className="border p-1" onClick={this.toggle}>
                <h6 
                    className="font-weight-bold text-wrap" 
                    style={{ "font-size": "50%" }}
                >
                    {this.props.name}
                </h6>
                <Modal 
                    isOpen={this.state.modal} 
                    toggle={this.toggle}
                    centered={true} 
                    size="lg"
                >
                    <ModalHeader toggle={this.toggle}>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <Input 
                                        placeholder="Card name..." 
                                        onChange={this.handleSearch.bind(this)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                <h3>
                                    {this.props.name}
                                </h3>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        <Container fluid>
                            <Row>
                                <Col className="zone-modal-body"> 
                                    <CardList 
                                        cardlist={this.currentVisibleCardList()} 
                                    />
                                </Col>
                                <Col xs="5">
                                    <Row>
                                        <HighlightedCard 
                                            cardInfo={this.state.cardList[this.state.currentCard]}
                                        />
                                    </Row>                            
                                    <Row>
                                        <ZoneContextMenu 
                                            name={this.props.name} 
                                        />
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
        return (
            <ListGroup className="zone-modal-list">
                {this.props.cardlist.map((item) => (
                    <ListGroupItem>{item}</ListGroupItem>
                ))}
            </ListGroup>
        );
    }
}

class HighlightedCard extends Component {
    render() {
        return (
            <Card
                name={this.props.cardInfo[0]}
                cost={this.props.cardInfo[1]}
                image={this.props.cardInfo[2]}
                type={this.props.cardInfo[3]}
                set={this.props.cardInfo[4]}
                text={this.props.cardInfo[5]}
                power={this.props.cardInfo[6]}
                divider={this.props.cardInfo[6] ? "/" : ""}
                toughness={this.props.cardInfo[7]}
            />
        );
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
        this.setState((prevState) => (
            { isOpen: !prevState.isOpen }
        ))
    }

    renderContextMenu() {
        return this.zoneList.filter((zoneName) => (
            !zoneName.match(this.props.name)
        )).map((zoneName) => (
            <DropdownItem>{zoneName}</DropdownItem>
        ))
    }

    render() {
        return (
            <Dropdown 
                isOpen={this.state.isOpen} 
                toggle={this.toggle.bind(this)}>
                <DropdownToggle caret>
                    Move card to...
                </DropdownToggle>
                <DropdownMenu right>
                    {this.renderContextMenu()}
                </DropdownMenu>
            </Dropdown>
            );
    }
}

export default SideZone;