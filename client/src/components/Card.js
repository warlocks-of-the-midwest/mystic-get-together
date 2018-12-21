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
			<Container fluid xs="12" className="card-container mh-100 h-100 mw-50 w-50 border rounded pt-0 pb-0 mb-0">
				<Row className="card-main-row flex-column">
					<Col xs="12" className="d-inline-flex text-truncate ">
						<Col xs="8">
							<h6>{this.props.name}</h6>
						</Col>
						<Col xs="4" className="text-right text-truncate">
							<p>{this.props.cost}</p>
						</Col>
					</Col>
					<Col xs="12" className="card-image">
						<Media className="media-image mh-100 h-100">
							<img
								className="img-fluid card-image mx-auto d-block mw-auto"
								alt="Card Art"
								src={this.props.image}
							/>
						</Media>
					</Col>
					<Col xs="12 mh-10 h-10" className="type-set-col clearfix">
						<Col xs="8" className="float-left mh-100 h-100 text-truncate">
							<p>{this.props.type}</p>
						</Col>
						<Col xs="4" className="float-right align-tofloat-right align-top col-4 mh-100 h-100">
							<Media className="set-image-media">
								<img
									className="set-image img-fluid "
									alt="Set Image"
									src={this.props.set}
								/>
							</Media>
						</Col>
					</Col>
					<Col xs="12" className="text-truncate">
						<p>{this.props.text}</p>
					</Col>
					<Col xs="12" className="text-right text-truncate">
						<p>{this.props.power}{this.props.divider}{this.props.toughness}</p>
					</Col>
				</Row>
			</Container >
		);
	}
}

export default Card;