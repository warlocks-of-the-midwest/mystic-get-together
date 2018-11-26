import React, { Component } from 'react';
import '../styles/Card.css';

class Card extends React.Component {
	constructor(props) {
		super(props);
		//this.show_image = this.show_image.bind(this);
	}
	
	render() {
		return (
			<div className="card-container">
				<div className="name">
					Sonic Assault	
				</div>
				<div className="cost">
					{'{1}{U}{R}'}
				</div>
				<div className="image-container">
					<img
						className="card-image"
						src={ require("./images/sonic-assault.jpg")}
					/>
				</div>
				<div className="type-container">
					Instant
				</div>
				<div className="set-logo-container">
					OO
				</div>
				<div className="text-container">
				Tap target creature. Sonic Assault deals 2 damage to that creature's controller.
				Jump-start (You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.)
				</div>
				<div className="power-toughness-container">
					
				</div>
			</div>
		);
	}
}

export default Card;