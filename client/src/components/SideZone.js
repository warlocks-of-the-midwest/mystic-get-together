import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Container,
  Modal, ModalHeader, ModalBody,
  Input, InputGroup,
  ListGroup, ListGroupItem,
} from 'reactstrap';
import Card from './Card.js';
import SideZoneContextMenu from './SideZoneContextMenu.js';
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
    this.cardListClick = this.cardListClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    this.setState((prevState) => (
      {
        modal: !prevState.modal,
        currentSearchTerm: '',
      }
    ));
  }

  /**
   * Returns the requested entry from the cardInfo array of the highlighted card.
   * @param {int} index
   */
  fetchCurrentCardInfo(index) {
    const { cardList, currentCard } = this.state;
    if (cardList.length > currentCard) {
      return cardList[currentCard][index];
    }
    return null;
  }

  /**
   * Handles onChange events for the modal's searchbar.
   * @param {event} event
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

  /**
   * Handles onClick events for the entries in the modal's card list.
   * @param {event} event
   */
  cardListClick(event) {
    const id = event.target.id.split('_');
    let index = 0;
    if (id.length > 1) {
      [, index] = id;
    }
    this.setState({ currentCard: index });
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
    const { name } = this.props;
    return (
      <ListGroup className="zone-modal-list">
        {this.currentVisibleCardList().map((item, index) => (
          <ListGroupItem
            key={index.toString()}
            onClick={this.cardListClick}
            id={`${name}_${item[1]}`}
          >
            {item[0]}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  render() {
    const { name } = this.props;
    const { modal } = this.state;
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
                    onChange={this.handleSearch}
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
                    <Card
                      name={this.fetchCurrentCardInfo(0)}
                      cost={this.fetchCurrentCardInfo(1)}
                      image={this.fetchCurrentCardInfo(2)}
                      type={this.fetchCurrentCardInfo(3)}
                      set={this.fetchCurrentCardInfo(4)}
                      text={this.fetchCurrentCardInfo(5)}
                      power={this.fetchCurrentCardInfo(6)}
                      divider={this.fetchCurrentCardInfo(6) ? '/' : ''}
                      toughness={this.fetchCurrentCardInfo(7)}
                    />
                  </Row>
                  <Row>
                    <SideZoneContextMenu
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

export default SideZone;
