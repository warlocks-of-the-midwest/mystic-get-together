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
			cards.push(<Card />);
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