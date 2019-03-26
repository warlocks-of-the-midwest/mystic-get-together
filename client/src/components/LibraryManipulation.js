import React, { Component } from 'react';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import CardList from './CardList';

class LibraryManipulation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.manipulate = this.manipulate.bind(this);

    this.state = {
      actionOpen: false,
      positionOpen: false,
      numberOpen: false,

      actionState: 'Move',
      positionState: 'top',
      numberState: '1',

      cardList: [],
    };
  }

  toggle(event) {
    const dropdownName = event.target.parentNode.id;
    this.setState((prevState) => ({
      [`${dropdownName}Open`]: !prevState[`${dropdownName}Open`],
    }));
  }

  select(event) {
    const eventTarget = event.target;
    const dropdownName = eventTarget.parentNode.parentNode.id;
    this.setState((prevState) => ({
      [`${dropdownName}State`]: eventTarget.innerText,
      [`${dropdownName}Open`]: !prevState[`${dropdownName}Open`],
    }));
  }

  manipulate() {
    const { actionState, positionState, numberState } = this.state;
    const { cardList } = this.props;

    this.setState(() => ({
      cardList,
    }));
    console.log(`Action: ${actionState} the ${positionState} ${numberState} card(s) of the library.`);
  }

  render() {
    const {
      actionOpen, positionOpen, numberOpen,
      actionState, positionState, numberState,
      cardList,
    } = this.state;
    const { cardClickHandler } = this.props;
    return (
      <div>
        <Row>
          <Dropdown id="action" isOpen={actionOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {actionState}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.select}>Move</DropdownItem>
              <DropdownItem onClick={this.select}>Reveal</DropdownItem>
              <DropdownItem onClick={this.select}>Look at</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          the
          <Dropdown id="position" isOpen={positionOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {positionState}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.select}>top</DropdownItem>
              <DropdownItem onClick={this.select}>bottom</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown id="number" isOpen={numberOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {numberState}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.select}>1</DropdownItem>
              <DropdownItem onClick={this.select}>2</DropdownItem>
              <DropdownItem onClick={this.select}>3</DropdownItem>
              <DropdownItem onClick={this.select}>4</DropdownItem>
            </DropdownMenu>
            cards of the library.
          </Dropdown>
          <br />
        </Row>
        <Button onClick={this.manipulate}>PERFORM</Button>
        <CardList listClickHandler={cardClickHandler} cardList={cardList} searchTerm="" />
      </div>
    );
  }
}
LibraryManipulation.propTypes = {
  cardClickHandler: PropTypes.func.isRequired,
  cardList: PropTypes.array.isRequired,
};

export default LibraryManipulation;
