import React, { Component } from 'react';
import '../styles/Card.css';

class Card extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="card-parent-container">
			<div className="card-container">
				<div className="name-mana-container">
					<div className="name">
						Sonic Assault	
					</div>
					<div className="cost">
						{'{1}{U}{R}'}
					</div>
				</div>
				<div className="image-container">
					<img
						className="card-image"
						src={ require("./images/aghoul.jpg")}
					/>
				</div>
				<div className="type-set-container">
					<div className="type-container">
						Instant
					</div>
					<div className="set-logo-container">
						OO
					</div>
				</div>
				<div className="text-container">
					Tap target creature. Sonic Assault deals 2 damage to that creature's controller.
					Jump-start (You may cast this card from your graveyard by discarding a card in addition to paying its other costs. Then exile this card.)
				</div>
				<div className="power-toughness-container">
					3/2
				</div>
			</div>
			</div>
		);
	}
}

export default Card;