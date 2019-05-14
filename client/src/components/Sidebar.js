import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

import SideZoneModal from './SideZoneModal';
import LibraryModal from './LibraryModal';
import withZone from './withZone';
import { Zones } from '../helpers';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    const { cards } = this.props;
    this.state = {
      cards,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cards } = nextProps;
    this.setState({
      cards,
    });
  }

  render() {
    const { cards } = this.state;
    const exile = _.filter(cards, (card) => _.get(card, 'state.zone') === Zones.EXILE);
    const graveyard = _.filter(cards, (card) => _.get(card, 'state.zone') === Zones.GRAVEYARD);
    const library = _.filter(cards, (card) => _.get(card, 'state.zone') === Zones.LIBRARY);

    const GraveyardWithModal = withZone(SideZoneModal, 'Graveyard', graveyard);
    const ExileWithModal = withZone(SideZoneModal, 'Exile', exile);
    const LibraryWithModal = withZone(LibraryModal, 'Library', library);

    return (
      <Container
        fluid
        className="d-flex sidebar-container mh-100 h-100 mw-100 w-100 p-0 m-0"
      >
        <Row
          className="justify-start sidebar-row mh-100 h-100 mw-100 w-100 p-0 m-0"
        >
          {/* Hand */}
          <Col
            xs="12"
            className="border p-1"
          >
            <h6
              className="font-weight-bold text-wrap"
              style={
                {
                  'font-size': '50%',
                }
              }
            >
              Hand
            </h6>
          </Col>
          <ExileWithModal />
          <GraveyardWithModal />
          <LibraryWithModal />
        </Row>
      </Container>
    );
  }
}

Sidebar.propTypes = {
  cards: PropTypes.array.isRequired,
};

export default Sidebar;
