import React, { Component } from 'react';
import '../styles/Card.css';
import { Jumbotron,
	Container,
	Row,
	Col,
	Button,
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
  DropdownItem } from 'reactstrap';

class Card extends React.Component {
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
			<Container fluid>
				<Row>
					<Col>
						<Navbar color="light" light expand="md">
						<NavbarBrand href="/">Menu</NavbarBrand>
							<NavbarToggler onClick={this.toggle} />
							<Collapse isOpen={this.state.isOpen} navbar>
								<Nav className="ml-auto" navbar>
									<NavItem>
										<NavLink href="/components/">Components</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
									</NavItem>
									<UncontrolledDropdown nav inNavbar>
										<DropdownToggle nav caret>
											Options
										</DropdownToggle>
										<DropdownMenu right>
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
					</Col>
					<Col>
						<Container>
							<Row>
								<Col xs="8">
									{this.props.name}
								</Col>
								<Col xs="4">
									{this.props.cost}
								</Col>
							</Row>
							<Row>
								<img
									className="card-image"
									src={this.props.image}
								/>
							</Row>
							<Row>
								<Col xs="6">
									{this.props.type}
								</Col>
								<Col xs="6">
									<img
										className="set-image"
										src={this.props.set}
									/>
								</Col>
							</Row>
							<Row>
								{this.props.text}
							</Row>
							<Row>
								{this.props.power}{this.props.divider}{this.props.toughness}
							</Row>
						</Container>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Card;