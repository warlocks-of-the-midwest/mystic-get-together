import React, { Component } from 'react';
import Axios from 'axios';
import '../styles/Card.css';

import {
  Container,
  Row,
  Col,
  Media,
  Button,
  UncontrolledPopover,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  url = 'https://api.scryfall.com/cards/1d9d8732-9ff2-42e4-bdfc-723cb6a76969?format=json';

  static parseScryfallData(data) {
    if (data) {
      var jsonObj = data;
      var name = jsonObj.name;
      var mana_cost = jsonObj.mana_cost;
      var image_uri_art_crop = jsonObj.image_uris.art_crop;
      var type_line = jsonObj.type_line;
      var set = jsonObj.set;
      var set_image = "https://img.scryfall.com/sets/" + set + ".svg?1545627600"
      var oracle_text = jsonObj.oracle_text;
      var power = jsonObj.power;
      var toughness = jsonObj.toughness;
      var cardInfo = [name,
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
        const response = await Axios.get('https://api.scryfall.com/cards/1d9d8732-9ff2-42e4-bdfc-723cb6a76969?format=json')
        return response.data;
      }
      catch (e) {
        console.error(e);
        return null;
      }
    }

    const data = await responsePromise();
    return Card.parseScryfallData(data);
  }

  static async getInfoScryfall(resolve, reject, x) {
    var response;
    try {
      response = await JSON.parse(Axios.get(x));
      console.log("got response: " + response.data);
      console.log("parsing response");
    }
    catch (e) {
      console.log(e)
    }

    resolve(response);
  }

  static async getScryfallCard(x) {
    console.log("in getscryfallcard with url: " + x);
    var cardInfo = [];
    var response;
    response = Card.getInfoScryfall(x);


    // var parse = async () => {
    //   var msg = await response();
    if (response.data) {
      console.log("inside msg parsing");
      var jsonObj = response.data;
      var name = jsonObj.name;
      var mana_cost = jsonObj.mana_cost;
      var image_uri_art_crop = jsonObj.image_uris.art_crop;
      var type_line = jsonObj.type_line;
      var set = jsonObj.set_uri;
      var setName = set.match("/\w+$/")
      var set_image = "https://img.scryfall.com/sets/" + setName + ".svg?1545627600"
      var oracle_text = jsonObj.oracle_text;
      var power = jsonObj.power;
      var toughness = jsonObj.toughness;
      cardInfo = [name,
        mana_cost,
        image_uri_art_crop,
        type_line,
        set_image,
        oracle_text,
        power,
        toughness
      ];
      console.log("end of async parse response function");
    }
    return cardInfo;
  }

  render() {
    return (
      <Container
        fluid
        className="card-container d-flex flex-column justify-content-center mh-100 h-100 mw-100 w-100 border rounded p-0 m-0"
        style={
          {
            "overflow": "hidden"
          }
        }
      >


        {/* Card name and mana cost row */}
        <Row
          className="card-name-cost-row d-inline-flex mx-0 px-1 justify-content-between flex-grow-5 flex-shrink-1"
          style={
            {
              "height": "10%",
              "max-height": "10%",
              "overflow": "hidden"
            }
          }
        >
          {/* Card name */}
          <Col
            xs="6"
            className="card-name-col px-0 flex-grow-5 flex-shrink-0 justify-content-start"
          >
            <p
              style={
                {
                  "font-size": ".4rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-name text-left text-nowrap mb-0 font-weight-bold"
            >
              {this.props.name}
            </p>
          </Col>

          {/* Mana cost */}
          <Col
            xs="6"
            className="card-mana-cost-col px-0 flex-shrink-3 flex-grow-1 justify-content-end">
            <p
              style={
                {
                  "font-size": ".375rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-cost text-right text-nowrap mb-0"
            >
              {this.props.cost}
            </p>
          </Col>
        </Row>


        {/* Image row with a col wrapper to control size of image */}
        <Row
          className="card-art-row justify-content-center mw-100 w-100 m-0 px-1 flex-grow-1 flex-shrink-5"
          style={
            {
              "height": "50%",
              "max-height": "50%",
              "flex-basis": "50%",
              "overflow": "hidden"
            }
          }
        >
          <Col
            xs="12"
            className="card-art-col p-0 mh-100"
          >
            <Media
              obj
              className="card-art-image img-fluid d-block mx-auto mh-100"
              alt="Card Art"
              src={this.props.image}
            />

          </Col>
        </Row>


        {/* Row for type and set logo */}
        <Row
          className="card-type-set-row justify-content-between px-1 m-0 flex-grow-1 flex-shrink-10"
          style={
            {
              "height": "10%",
              "max-height": "10%",
              "flex-basis": "10%",
              "overflow": "hidden"
            }
          }
        >
          {/* Card type */}
          <Col
            className="card-type-col d-flex px-0 text-left">
            <p
              style={
                {
                  "font-size": ".375rem",
                  "text-overflow": "hidden"
                }
              }
              className="card-type mb-0 text-left text-nowrap"
            >
              {this.props.type}
            </p>
          </Col>

          {/* Card set image */}
          <Media
            className="card-set-image-col d-flex px-0 py-0 flex-shrink-2 clearfix"
            style={
              {
                "max-height": "100%",
                "height": "100%",
                "overflow": "hidden"
              }
            }
          >

            <Media
              obj
              style={
                {
                  "max-height": "100%",
                  "min-height": "1vmin",
                }
              }
              className="set-image img-fluid mh-100 float-right ml-auto align-top"
              alt="Set Image"
              src={this.props.set}
            />

          </Media>
        </Row>


        {/* Card text */}
        <Row
          className="card-text-row px-1 m-0 flex-grow-1 flex-shrink-5"
          style={{
            "height": "20%",
            "max-height": "20%",
            "flex-basis": "20%",
            "overflow": "scroll"
          }}
        >
          <Col
            xs="12"
            className="card-text-col d-flex flex-shrink-5 flex-grow-1 p-0"
          >
            <Button id="UncontrolledPopover" type="button">
              Launch Popover
            </Button>
            <UncontrolledPopover placement="bottom" target="UncontrolledPopover">
              <PopoverHeader>Popover Title</PopoverHeader>
              <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
            </UncontrolledPopover>
            <p
              className="card-text text-left text-wrap mb-0"
              style={
                {
                  "font-size": ".4rem",
                  "text-overflow": "hidden",
                  "overflow": "hidden"
                }
              }
            >
              {this.props.text}
            </p>
          </Col>
        </Row>


        {/* Power and toughness if creature */}
        <Row
          className="card-power-toughness-row m-0 px-1 d-inline-flex flex-grow-1 flex-shrink-5"
          style={
            {
              "height": "10%",
              "max-height": "10%",
              "flex-basis": "10%",
              "overflow": "hidden"
            }
          }
        >
          <Col
            xs="10"
            className="left-padding-for-power-toughness"
          >
          </Col>
          <Col
            xs="2"
            className="card-power-toughness-col px-1 d-flex flex-shrink-1 flex-grow-2 clearfix"
            style={
              {
                // "max-height": "5%"
              }
            }
          >
            <p
              className="card-power-toughness float-right m-0 text-right text-nowrap"
              style={
                {
                  "font-size": ".4rem",
                  "text-overflow": "hidden"
                }
              }
            >
              {/* Don't forget to add the divider when inputting power and toughness */}
              {this.props.power}{this.props.divider}{this.props.toughness}
            </p>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default Card;