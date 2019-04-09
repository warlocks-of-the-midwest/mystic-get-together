import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import '../js-sdk/sdk';
import { Zones } from '../helpers';
import { moveCardToZone } from '../js-sdk/sdk';

class SideZoneContextMenu extends Component {
  zoneList = ['Graveyard', 'Exile', 'Library', 'Hand', 'Battlefield'];

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentCard: null,
    };

    this.toggle = this.toggle.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { currentCard } = nextProps;
    this.setState({ currentCard });
  }

  toggle() {
    this.setState((prevState) => (
      { isOpen: !prevState.isOpen }
    ));
  }

  moveCard(event) {
    const { target } = event;
    const { currentCard } = this.state;

    if (currentCard !== null) {
      moveCardToZone(null, currentCard.id, target.innerText.toLowerCase());
    }
  }

  renderContextMenu() {
    const { name } = this.props;
    return this.zoneList.filter((zoneName) => (
      !zoneName.match(name)
    )).map((zoneName, index) => (
      <DropdownItem
        key={index.toString()}
        onClick={this.moveCard}
      >
        {zoneName}
      </DropdownItem>
    ));
  }

  render() {
    const { isOpen } = this.state;
    return (
      <Dropdown
        isOpen={isOpen}
        toggle={this.toggle}
      >
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
SideZoneContextMenu.propTypes = {
  name: PropTypes.string.isRequired,
  currentCard: PropTypes.array.isRequired,
};

export default SideZoneContextMenu;
