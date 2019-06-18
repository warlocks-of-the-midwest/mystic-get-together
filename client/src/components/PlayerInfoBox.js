import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../styles/Battlefield.css';

class PlayerInfoBox extends Component {
  render() {
    const { player, shouldRender, position } = this.props;

    let positionClass = 'leftInfoBar';
    if (position === 'right') {
      positionClass = 'rightInfoBar';
    }

    if (shouldRender && player) {
      return (
        <div
          className={`infoBar ${positionClass}`}
        >
          <div>Username:</div>
          <div
            className="largeEllipsisText"
            style={{
              'font-size': '0.7em',
            }}
          >
            {player.getUsername()}
          </div>
          <div>Life Total: <span
            className="largeEllipsisText"
            >{player.getLife()}
            </span>
          </div>
          <div>Infect: <span
            className="largeEllipsisText"
            >0
            </span>
          </div>
          <div>CMDR 1: <span
            className="largeEllipsisText"
            >3
            </span>
          </div>
          <div>CMDR 2: <span
            className="largeEllipsisText"
            >0
            </span>
          </div>
          <div>CMDR 3: <span
            className="largeEllipsisText"
            >8
            </span>
          </div>
        </div>
      );
    }

    return (null);
  }
}

PlayerInfoBox.propTypes = {
  player: PropTypes.object.isRequired,
  shouldRender: PropTypes.bool.isRequired,
  position: PropTypes.string.isRequired,
};

export default PlayerInfoBox;
