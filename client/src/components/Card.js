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
	}

	
	
	render() {
		return (
			<Container fluid>
				<Row>
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