import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Container,
  Modal, ModalHeader, ModalBody,
  Input, InputGroup,
  ListGroup, ListGroupItem,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import Card from './Card.js';
import '../styles/Zones.css';

class SideZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      cardList: [],
      currentSearchTerm: '',
      currentCard: 0,
    };

    this.loadCardList();
    this.toggle = this.toggle.bind(this);
  }

  /**
   * Fetches the cardInfo objects associated with the urls in props.cardlist
   * and stores them in this.state. This is only done once.
   */
  loadCardList() {
    const { cardlist } = this.props;
    Promise.all(cardlist.map((cardUrl) => (
      Card.getScryFallCardInfo(cardUrl)
    ))).then((results) => (
      this.setState(() => ({ cardList: results }))
    ));
  }

  /**
   * Toggles the modal state. Also resets this.state.currentSearchTerm.
   */
  toggle() {
    this.setState((prevState, props) => (
      {
        modal: !prevState.modal,
        currentSearchTerm: '',
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
        currentSearchTerm: val,
      }
    ));
  }

  cardListClick(cardIndex, event) {
    this.setState({ currentCard: cardIndex });
  }

  /**
   * Returns a list containing the card names of all cards in
   * this.state.cardList that match this.state.currentSearchTerm.
   */
  currentVisibleCardList() {
    const { cardList, currentSearchTerm } = this.state;
    if (cardList != null) {
      return cardList.map((cardInfo, index) => (
        [cardInfo[0], index]
      )).filter((card) => (
        card[0].toLowerCase().includes(
          currentSearchTerm.toLowerCase()
        )
      ));
    }
    return null;
  }

  renderCardList() {
    return (
      <ListGroup className="zone-modal-list">
        {this.currentVisibleCardList().map((item) => (
          <ListGroupItem
            onClick={this.cardListClick.bind(this, item[1])}
          >
            {item[0]}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  render() {
    const { name } = this.props;
    const { cardList, currentCard, modal } = this.state;
    return (
      <Col xs="12" className="border p-1" onClick={this.toggle}>
        <h6
          className="font-weight-bold text-wrap"
          style={{ 'font-size': '50%' }}
        >
          {name}
        </h6>
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          centered
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
                  {name}
                </h3>
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <Container fluid>
              <Row>
                <Col className="zone-modal-body">
                  {this.renderCardList()}
                </Col>
                <Col xs="5">
                  <Row>
                    <HighlightedCard
                      cardInfo={cardList[currentCard]}
                    />
                  </Row>
                  <Row>
                    <ZoneContextMenu
                      name={name}
                    />
                  </Row>
                </Col>
              </Row>
            </Container>
          </ModalBody>
        </Modal>
      </Col>
    );
  }
}
SideZone.propTypes = {
  name: PropTypes.string.isRequired,
  cardlist: PropTypes.array.isRequired,
};

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
