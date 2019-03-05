import React from 'react';
import {
  Col,
} from 'reactstrap';
import '../styles/Zones.css';

function withZone(WrappedModal, name, zoneCardList) {
  return class ModalWithZone extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        modalOpen: false,
      };

      this.toggle = this.toggle.bind(this);
    }

    /**
     * Toggles the modal state. Also resets this.state.currentSearchTerm.
     */
    toggle() {
      this.setState((prevState) => (
        {
          modalOpen: !prevState.modalOpen,
        }
      ));
    }


    render() {
      const { modalOpen } = this.state;
      return (
        <Col xs="12" className="border p-1" onClick={this.toggle}>
          <h6
            className="font-weight-bold text-wrap"
            style={{ 'font-size': '50%' }}
          >
            {name}
          </h6>
          <WrappedModal
            cardList={zoneCardList}
            modalToggle={this.toggle}
            modalOpen={modalOpen}
            name={name}
          />
        </Col>
      );
    }
  };
}

export default withZone;
