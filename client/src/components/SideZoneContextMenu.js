import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';

class SideZoneContextMenu extends Component {
  zoneList = ['Graveyard', 'Exile', 'Library', 'Hand', 'Battlefield'];

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => (
      { isOpen: !prevState.isOpen }
    ));
  }

  renderContextMenu() {
    const { name } = this.props;
    return this.zoneList.filter((zoneName) => (
      !zoneName.match(name)
    )).map((zoneName, index) => (
      <DropdownItem key={index.toString()}>
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
};

export default SideZoneContextMenu;
