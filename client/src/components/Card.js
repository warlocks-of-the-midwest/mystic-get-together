import React, { Component } from "react";
import Axios from "axios";
import "../styles/Card.css";

import "bootstrap/dist/js/bootstrap.bundle.js";
import $ from "jquery";

import {
  Container,
  Row,
  Col,
  Media,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  url =
    "https://api.scryfall.com/cards/1d9d8732-9ff2-42e4-bdfc-723cb6a76969?format=json";

  static parseScryfallData(data) {
    if (data) {
      var jsonObj = data;
      var name = jsonObj.name;
      var mana_cost = jsonObj.mana_cost;
      var image_uri_art_crop = jsonObj.image_uris.art_crop;
      var type_line = jsonObj.type_line;
      var set = jsonObj.set;
      var set_image =
        "https://img.scryfall.com/sets/" + set + ".svg?1545627600";
      var oracle_text = jsonObj.oracle_text;
      var power = jsonObj.power;
      var toughness = jsonObj.toughness;
      var cardInfo = [
        name,
        mana_cost,
        image_uri_art_crop,
        type_line,
        set_image,
        oracle_text,
        power,
        toughness
      ];
      return cardInfo;
    }
  }

  static async getScryFallCardInfo(url) {
    const responsePromise = async () => {
      try {
        const response = await Axios.get(url);
        return response.data;
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    const data = await responsePromise();
    return Card.parseScryfallData(data);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  componentDidMount() {
    $(function() {
      $('[data-toggle="popover"]').popover();
    });
  }

  render() {
    return (
      <Container
        fluid
        className="card-container d-flex flex-column justify-content-center mh-100 h-100 mw-100 w-100 border rounded p-0 m-0"
        style={{
          "overflow-y": "auto",
          "overflow-x": "hidden"
        }}
      >
        {/* Card name and mana cost row */}
        <Row
          className="card-name-cost-row d-inline-flex flex-nowrap mw-100 mx-0 px-1 justify-content-between flex-grow-0 flex-shrink-0"
          style={{
            "font-size": "1.5vh",
            "flex-basis": "2vh"
          }}
        >
          {/* Card name */}
          <Col
            xs="6"
            className="card-name-col pl-0 pr-1 flex-grow-0 flex-shrink-2 justify-content-start"
            style={{
              "flex-basis": "5%",
              "max-width": "80%"
            }}
          >
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-name-pop text-dark bg-transparent m-0 p-0 align-top text-left text-wrap mh-100 h-100 mw-100 w-100"
              s
              data-toggle="popover"
              data-trigger="focus"
              title={this.props.name}
              data-content={this.props.name}
              id="Popover"
              style={{
                "text-overflow": "ellipsis",
                overflow: "hidden"
              }}
            >
              {this.props.name}
            </button>
          </Col>

          {/* Mana cost */}
          <Col
            xs="4"
            className="card-mana-cost-col px-0 flex-shrink-1 flex-grow-2 justify-content-end"
            style={{
              "flex-basis": "95%",
              "min-width": "20%"
            }}
          >
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-cost-pop text-dark bg-transparent m-0 p-0 align-start text-left text-wrap mh-100 h-100 mw-100 w-100"
              data-toggle="popover"
              data-trigger="focus"
              title={this.props.name}
              data-content={this.props.cost}
              id="Popover"
              style={{
                "font-size": "1.5vh",
                "text-overflow": "ellipsis",
                overflow: "hidden"
              }}
            >
              {this.props.cost}
            </button>
          </Col>
        </Row>

        {/* Image row with a col wrapper to control size of image */}
        <Row
          className="card-art-row justify-content-center mw-100 w-100 m-0 px-1 flex-grow-1 flex-shrink-1"
          style={{
            "flex-basis": "40%",
            overflow: "hidden"
          }}
        >
          <Col xs="12" className="card-art-col p-0 mh-100">
            <Media
              obj
              className="card-art-image img-fluid d-block mx-auto h-100 mh-100 w-100 mw-100"
              alt="Card Art"
              src={this.props.image}
            />
          </Col>
        </Row>

        {/* Row for type and set logo */}
        <Row
          className="card-type-set-row justify-content-around px-1 m-0 flex-grow-1 flex-shrink-5"
          style={{
            "font-size": "1.5vh",
            "flex-basis": "1vh",
            "max-height": "1.5vh"
          }}
        >
          {/* Card type */}
          <Col
            className="card-type-col d-flex flex-grow-10 flex-shrink-1 align-items-center px-0 h-100 mh-100 mw-100 w-100 text-left"
            style={{
              "flex-basis": "50%",
              overflow: "hidden"
            }}
          >
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-type-pop text-dark bg-transparent m-0 p-0 align-items-start align-top text-left text-wrap mh-100 h-100 mw-100 w-100"
              data-toggle="popover"
              data-trigger="focus"
              data-content={this.props.type}
              id="Popover"
              value={this.props.type}
              style={{
                "font-size": "1vh",
                "text-overflow": "ellipsis",
                overflow: "hidden"
              }}
            >
              {this.props.name}
            </button>
          </Col>
          <Col
            className="flex-shrink-10 set-image-col align-items-baseline flex-grow-1 p-0 m-0 mh-100"
            style={{
              "flex-basis": "10%",
              overflow: "hidden"
            }}
          >
            {/* Card set image */}
            <Media
              obj
              className="set-image img-fluid d-block mx-auto align-self-baseline"
              alt="Set Image"
              src={this.props.set}
              style={{
                "max-height": "100%"
              }}
            />
          </Col>
        </Row>

        {/* Card text */}
        <Row
          className="card-text-row px-1 m-0 align-items-stretch flex-grow-1 flex-shrink-10"
          style={{
            "flex-basis": "2vh",
            "max-height": "5vh"
          }}
        >
          <Col
            xs="12"
            className="card-text-col d-flex align-items-stretch mh-100 h-100 m-0 p-0"
          >
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-text-pop text-dark bg-transparent m-0 p-0 align-top text-left text-wrap mh-100 h-100 mw-100 w-100"
              data-toggle="popover"
              data-trigger="focus"
              title={this.props.name}
              data-content={this.props.text}
              id="Popover"
              style={{
                "font-size": "1.5vh",
                "text-overflow": "ellipsis",
                overflow: "hidden"
              }}
            >
              {this.props.text}
            </button>
          </Col>
        </Row>

        {/* Power and toughness if creature */}
        <Row
          className="card-power-toughness-row d-inline-flex mx-0 px-1 justify-content-between flex-grow-1 flex-shrink-0"
          style={{
            overflow: "hidden",
            "font-size": "1.5vh",
            "flex-basis": "1vh",
            "max-height": "2vh",
            "min-height": "0"
          }}
        >
          <Col xs="8" className="left-padding-for-power-toughness px-0" />
          <Col
            xs="4"
            className="card-power-toughness-col px-0 d-flex flex-shrink-0 flex-grow-2 justify-content-end"
          >
            <button
              tabIndex="0"
              type="button"
              color="link"
              block
              size="sm"
              className="card-power-toughness text-dark bg-transparent m-0 p-0 align-top text-left text-wrap mh-100 h-100 mw-100 w-100"
              data-toggle="popover"
              data-trigger="focus"
              title={this.props.name}
              data-content={
                this.props.power + this.props.divider + this.props.toughness
              }
              id="Popover"
              style={{
                "font-size": "1.5vh",
                "text-overflow": "ellipsis",
                overflow: "hidden"
              }}
            >
              {/* Don't forget to add the divider when inputing power and toughness */}
              {this.props.power}
              {this.props.divider}
              {this.props.toughness}{" "}
            </button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Card;
