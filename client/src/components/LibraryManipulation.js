import React, { Component } from 'react';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import CardList from './CardList';
import { Zones } from '../helpers';
import { moveCardToZone } from '../js-sdk/sdk';
import '../styles/Modal.css';

class LibraryManipulation extends Component {
  zoneList = Object.values(Zones);

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.manipulate = this.manipulate.bind(this);
    this.moveCards = this.moveCards.bind(this);
    this.displayNumberDropdown = this.displayNumberDropdown.bind(this);

    this.state = {
      actionOpen: false,
      positionOpen: false,
      numberOpen: false,
      destOpen: false,

      actionState: 'Move',
      positionState: 'top',
      numberState: '1',
      destState: 'Battlefield',

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

  displayNumberDropdown() {
    const listLength = this.props.cardList.length;
    const dropdown = [];

    for (let i = 0; i < listLength; i += 1) {
      dropdown.push(
        <DropdownItem onClick={this.select}>
          {i + 1}
        </DropdownItem>
      );
    }
    return dropdown;
  }

  parameterEnd() {
    const { actionState, destState, destOpen } = this.state;

    let parameterEnd = null;

    if (actionState === 'Move') {
      parameterEnd = (
        <div><span> cards from the library to </span>
          <Dropdown
            group
            size="sm"
            id="dest"
            isOpen={destOpen}
            toggle={this.toggle}
          >
            <DropdownToggle caret>{destState}</DropdownToggle>
            <DropdownMenu>
              {this.zoneList.map((zoneName, index) => (
                <DropdownItem
                  key={index.toString()}
                  onClick={this.select}
                >
                  {zoneName}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    } else {
      parameterEnd = (
        <span> cards of the library.</span>
      );
    }
    return parameterEnd;
  }

  moveCards(cardList) {
    const { destState } = this.state;
    const gameId = 'FtNnLrn6SugiK8C4naOx';

    cardList.map((card) => (moveCardToZone(gameId, card.id, destState)));
  }

  manipulate() {
    const { actionState, positionState, numberState, destState } = this.state;
    let { cardList } = this.props;
    cardList = cardList.sort((a, b) => a.state.position - b.state.position);
    if (positionState === 'top') {
      cardList = cardList.slice(0, numberState);
    } else {
      cardList = cardList.slice(-numberState);
    }

    switch (actionState) {
      case 'Move':
        console.log(`Moving the ${positionState} ${numberState} cards of the library to ${destState}`);
        this.moveCards(cardList);
        break;
      case 'Reveal':
        console.log(`Revealing the ${positionState} ${numberState} cards of the library.`);
        this.setState(() => ({ cardList }));
        break;
      case 'Look at':
        console.log(`Looking at the ${positionState} ${numberState} cards of the library.`);
        this.setState(() => ({ cardList }));
        break;
      default:
    }
  }

  render() {
    const {
      actionOpen, positionOpen, numberOpen,
      actionState, positionState, numberState,
      cardList,
    } = this.state;
    const { cardClickHandler } = this.props;
    return (
      <div id="parameters">
        <Dropdown
          group
          id="action"
          isOpen={actionOpen}
          toggle={this.toggle}
          size="sm"
        >
          <DropdownToggle caret>
            {actionState}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.select}>Move</DropdownItem>
            <DropdownItem onClick={this.select}>Reveal</DropdownItem>
            <DropdownItem onClick={this.select}>Look at</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <br />
        the
        <br />
        <Dropdown
          group
          id="position"
          isOpen={positionOpen}
          toggle={this.toggle}
          size="sm"
        >
          <DropdownToggle caret>
            {positionState}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.select}>top</DropdownItem>
            <DropdownItem onClick={this.select}>bottom</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          group
          id="number"
          isOpen={numberOpen}
          toggle={this.toggle}
          modifiers={{
            setMaxHeight: {
              enabled: true,
              fn: (data) => ({
                ...data,
                styles: {
                  ...data.styles,
                  overflow: 'auto',
                  position: 'absolute',
                  maxHeight: 100,
                },
              }),
            },
          }}
        >
          <DropdownToggle caret>
            {numberState}
          </DropdownToggle>
          <DropdownMenu>
            {this.displayNumberDropdown()}
          </DropdownMenu>
        </Dropdown>
        {this.parameterEnd()} <br />
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
