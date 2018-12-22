import React, { Component } from 'react';
import '../styles/Card.css';
import {
	Jumbotron,
	Container,
	Row,
	Col,
	Button,
	Collapse,
	Media,
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

class Card extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container fluid xs="12" className="card-container mh-100 h-100 mw-50 border rounded p-0 m-0">
				<Row className="card-main-row mh-100 mw-50 px-3">

					{/* Card name and mana cost row */}
					<Col xs="12" className="d-inline-flex px-1 flex-grow-2 flex-shrink-1 justify-content-between" style={{ "max-height": "10%" }}>
						<Col className="name-col px-0  text-truncate flex-shrink-1 flex-grow-5 justify-content-start">
							<p style={{ "font-size": "3vmin" }} className="text-left">{this.props.name}</p>
						</Col>
						<Col className="cost-col px-0 text-truncate flex-shrink-3 flex-grow-1 justify-content-end">
							<p style={{ "font-size": "3vmin" }} className="text-right font-weight-light">{this.props.cost}</p>
						</Col>
					</Col>

					{/* Image row */}
					<Col xs="12" className="card-image-col px-1 mx-auto" style={{ "max-width": "20vmin", "max-height": "40%" }}>
						<img
							className="card-art-image img-fluid d-block"
							style={{ "max-height": "100%" }}
							alt="Card Art"
							src={this.props.image}
						/>
					</Col>

					{/* Row for type and set logo */}
					<Col xs="12" className="d-flex px-1 pb-1 flex-shrink-3 flex-grow-1 justify-content-between type-set-col clearfix" style={{ "max-height": "3vmin", "height": "3vmin" }}>
						<Col xs="8" className="type-col px-0 flex-shrink-1 text-left">
							<p style={{ "font-size": "3vmin" }} className="text-left font-weight-light">{this.props.type}</p>
						</Col>
						<Col xs="4" className="d-flex px-0 flex-shrink-2 float-right align-top ml-auto col-4" style={{ "max-height": "100%" }}>
							<img
								className="set-image img-fluid mh-100"
								alt="Set Image"
								src={this.props.set}
							/>
						</Col>
					</Col>

					{/* Card text */}
					<Col xs="12" className="card-text-row px-1 d-flex flex-shrink-1 flex-grow-4 text-left text-truncate" style={{ "max-height": "5vmin", "min-height": "5vmin" }}>
						<p style={{ "font-size": "3vmin" }}>{this.props.text}</p>
					</Col>

					{/* Power and toughness if creature */}
					<Col xs="12" className="card-power-toughness px-1 d-flex flex-shrink-1 flex-grow-2 text-right" style={{ "max-height": "10%" }}>
						<p style={{ "font-size": "3vmin" }}>{this.props.power}{this.props.divider}{this.props.toughness}</p>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Card;