import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/NavigationBar.css';

import {
  Button,
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  render() {
    return (
      <Container fluid className="h-100 p-0 m-0">
        <Navbar light expand="md" className="expand-sm mh-100 h-100 m-0 p-1">
          <NavbarBrand dark className="bg-light">
            Battlefield
          </NavbarBrand>
          <div className="navbar-text">
            Life: {this.props.life}
          </div>
          <NavbarToggler className="mh-100 h-100 m-0 p-0" onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar horizontal tabs>
              <NavItem>
                <NavLink href="/components/">Hand</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Battlefield</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
								</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Anthony
									</DropdownItem>
                  <DropdownItem>
                    Option 1
									</DropdownItem>
                  <DropdownItem>
                    Option 2
									</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
							    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    );
  }
}

export default NavigationBar;