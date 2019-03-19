import _ from 'lodash';
import React, { Component } from 'react';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';

class LibraryManipulation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { dropdownOpen: false };
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    const { dropdownOpen } = this.state;
    return (
      <div>
        <Row>
          <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Action
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Move</DropdownItem>
              <DropdownItem>Reveal</DropdownItem>
              <DropdownItem>Look at</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          the
          <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Position
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>top</DropdownItem>
              <DropdownItem>bottom</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Number
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>1</DropdownItem>
              <DropdownItem>2</DropdownItem>
              <DropdownItem>3</DropdownItem>
              <DropdownItem>4</DropdownItem>
            </DropdownMenu>
            cards of the library.
          </Dropdown>
          <br />
        </Row>
        <Button>PERFORM</Button>
      </div>
    );
  }
}
LibraryManipulation.propTypes = {
};

export default LibraryManipulation;
