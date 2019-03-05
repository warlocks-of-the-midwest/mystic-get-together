import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Container,
  Modal, ModalHeader, ModalBody,
  Input, InputGroup,
} from 'reactstrap';
import Card from './Card.js';
import CardList from './CardList.js';
import SideZoneContextMenu from './SideZoneContextMenu.js';
import '../styles/Zones.css';

class SideZoneModal extends Component {
  constructor(props) {
    super(props);

    const { cardList } = this.props;

    this.state = {
      searchTerm: '',
      currentCard: null,
      cardList,
    };

    this.toggleModalState = this.toggleModalState.bind(this);
    this.cardListClick = this.cardListClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { cardList } = nextProps;
    this.setState({
      cardList,
    });
  }

  /**
   * Resets the current search term, then toggles modal state.
   */
  toggleModalState() {
    const { modalToggle } = this.props;

    this.setState({ searchTerm: '' });
    modalToggle();
  }

  /**
   * Handles onChange events for the modal's searchbar.
   * @param {event} event
   */
  handleSearch(event) {
    const val = event.target.value;

    this.setState({
      searchTerm: val.toLowerCase(),
    });
  }

  /**
   * Handles onClick events for the entries in the modal's card list.
   * @param {event} event
   */
  cardListClick(event) {
    const { cardList } = this.state;
    this.setState({
      currentCard: _.find(cardList, (card) => card.id === event.target.id),
    });
  }

  render() {
    const { name, modalOpen } = this.props;
    const { currentCard, cardList, searchTerm } = this.state;

    return (
      <Modal
        isOpen={modalOpen}
        toggle={this.toggleModalState}
        centered
        size="lg"
      >
        <ModalHeader toggle={this.toggleModalState}>
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
                <CardList
                  listClickHandler={this.cardListClick}
                  cardList={cardList}
                  searchTerm={searchTerm}
                />
              </Col>
              <Col xs="5">
                <Row>
                  {currentCard && (
                    <Card
                      card={currentCard}
                    />
                  )}
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
    );
  }
}
SideZoneModal.propTypes = {
  cardList: PropTypes.array.isRequired,
  modalToggle: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default SideZoneModal;
