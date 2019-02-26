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

class SideZone extends Component {
  constructor(props) {
    super(props);

    const { cardList } = this.props;

    this.state = {
      modal: false,
      searchTerm: '',
      currentCard: null,
      cardList,
    };

    this.toggle = this.toggle.bind(this);
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
    const { name } = this.props;
    const { currentCard, modal, cardList, searchTerm } = this.state;

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
      </Col>
    );
  }
}
SideZone.propTypes = {
  name: PropTypes.string.isRequired,
  cardList: PropTypes.array.isRequired,
};

export default SideZone;
