import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonGroup,
  Col, Row, Container,
  Modal, ModalHeader, ModalBody,
  Input, InputGroup,
} from 'reactstrap';

import CardList from './CardList.js';
import CurrentCard from './CurrentCard.js';
import LibraryManipulation from './LibraryManipulation.js';
import SideZoneContextMenu from './SideZoneContextMenu.js';
import '../styles/Zones.css';

class LibraryModal extends Component {
  constructor(props) {
    super(props);

    const { cardList } = this.props;

    this.state = {
      modalFunction: 'search',
      searchTerm: '',
      currentCard: null,
      cardList,
    };

    this.setModalFunction = this.setModalFunction.bind(this);

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

  setModalFunction(event) {
    const func = event.target.id.split('_')[1];
    this.setState(() => (
      {
        modalFunction: func,
      }
    ));
  }

  /**
   * Toggles the modal state. Also resets this.state.currentSearchTerm.
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

  renderLibModalBody() {
    const { cardList, modalFunction, searchTerm } = this.state;

    let modalBody = null;

    if (modalFunction === 'search') {
      modalBody = (
        <ModalBody className="library-modal-body">
          <Row>
            <InputGroup>
              <Input
                placeholder="Card name..."
                onChange={this.handleSearch}
              />
            </InputGroup>
          </Row>
          <Row>
            <CardList
              listClickHandler={this.cardListClick}
              cardList={cardList}
              searchTerm={searchTerm}
            />
          </Row>
        </ModalBody>
      );
    } else if (modalFunction === 'manipulate') {
      modalBody = (
        <ModalBody classname="library-modal-body">
          <Row>
            <LibraryManipulation />
          </Row>
        </ModalBody>
      );
    }
    return modalBody;
  }

  render() {
    const { name, modalOpen } = this.props;
    const { currentCard } = this.state;

    return (
      <Modal
        isOpen={modalOpen}
        toggle={this.toggleModalState}
        centered
        size="lg"
      >
        <ModalHeader toggle={this.toggleModalState}>
          <Row>
            <h3>Library</h3>
          </Row>
        </ModalHeader>
        <ModalBody>
          <Container fluid>
            <Row>
              <Col className="zone-modal-body">
                <Row>
                  <ButtonGroup className="library-function-buttons">
                    <Button
                      type="radio"
                      name="radio"
                      id="lib_search"
                      onClick={this.setModalFunction}
                    >
                      Search
                    </Button>
                    <Button
                      type="radio"
                      name="radio"
                      id="lib_manipulate"
                      onClick={this.setModalFunction}
                    >
                      Manipulate
                    </Button>
                  </ButtonGroup>
                </Row>
                {this.renderLibModalBody()}
              </Col>
              <Col xs="5">
                <Row>
                  <CurrentCard currentCard={currentCard} />
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
LibraryModal.propTypes = {
  cardList: PropTypes.array.isRequired,
  modalToggle: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default LibraryModal;
