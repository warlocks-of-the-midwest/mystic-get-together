import React, { Component } from 'react';
import '../styles/GameArea.css';

class GameArea extends Component {
  constructor(props) {
    super(props);
    
    this.show_image = this.show_image.bind(this);
  }
  
  show_image() {
		var img = document.createElement("img");
    img.src = "./Abattoir Ghoul.png";
    img.width = 100;
    img.height = 100;
    img.alt = "Abbatoir";

    return (<div>
              <img src="AbatoirGhoul.png" heigh="100" width="100"/>
            </div>);
	}
  
  render() {
    return (
      <div className="game-area">
        
        <div className="board">
        	<h1>Main Board</h1>
          <div>
            <img src= {require("./images/AbattoirGhoul.png")} height="300px" width="200px"/>
          </div>
        </div>
        
        <div className="side-area">
          
          <div className="temp">
          	<h4>Life</h4>
          	<p>40</p>
          </div>
          
          <div className="temp">
          	<h4>Exile</h4>
          	<img src="./images/AbattoirGhoul.png" height="150" width="150">
          	</img>
          </div>

          <div className="temp">
			<h4>Grave</h4>
			<body>
				<button onclick=
    				"show_image('./AbattoirGhoul.png', 
                 	276, 
                 	110, 
                 	'Abb');">"Show Graveyard"
             	</button> 
			</body>
          </div>
          
          <div className="temp">
			<h4>Hand</h4>
          	<p>0</p>
          </div>
          
          <div className="temp">
			<h4>Library</h4>
          	<p>40</p>
          </div>
        
        </div>
      
      </div>
    );
  }

  
}

export default GameArea;
