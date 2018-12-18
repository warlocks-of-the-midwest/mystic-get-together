import React, { Component } from 'react';
import '../styles/Hand.css';
import Card from './Card';

class Hand extends React.Component {
	constructor(props) {
		super(props);
		this.generateSevenCards = this.generateSevenCards.bind(this);
	}
	
	generateSevenCards() {
		var cards = [];
		for(var i = 0; i < 7; i++) {
			cards.push(<Card name="Sonic Assault"
			cost="{1}{U}{R}"
			image="https://img.scryfall.com/cards/art_crop/front/c/c/cc61a398-cf16-415b-b3cf-897217dc7cc9.jpg?1538880557"
			type="Instant"
			set="https://api.scryfall.com/sets/grn"
			text="Card text here"/>);
		}
		return cards;
	}
	
	render() {
		return (
			<div className="hand-parent-container">
				<div className="hand-container">
					{this.generateSevenCards()}
				</div>
			</div>
		);
	}
}

export default Hand;