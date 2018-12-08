import React, { Component } from 'react';
import '../styles/Card.css';

class Card extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			// TODO: Remove card-parent-container
			<div className="card-parent-container">
			<div className="card-container">
				<div className="name-mana-container">
					<div className="name">
						{this.props.name}
					</div>
					<div className="cost">
						{this.props.cost}
					</div>
				</div>
				<div className="image-container">
					<img
						className="card-image"
						src={this.props.image}
					/>
				</div>
				<div className="type-set-container">
					<div className="type-container">
						{this.props.type}
					</div>
					<div className="set-logo-container">
						{this.props.set}
					</div>
				</div>
				<div className="text-container">
					{this.props.text}
				</div>
				<div className="power-toughness-container">
					{this.props.power}/{this.props.toughness}
				</div>
			</div>
			</div>
		);
	}
}

export default Card;