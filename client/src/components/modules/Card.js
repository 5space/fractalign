import React, { Component } from "react";
import FractalRenderer from "./FractalRenderer.js";

import "./Card.css";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="Card-container" onClick={() => {window.location.assign(`/post/${this.props.post._id}`);}}>
                <FractalRenderer fractal={this.props.post.fractal} width="400" height="300"/>
                <div className="Card-title u-bold">
                    {this.props.post.title}
                </div>
                <div className="Card-description">
                    {this.props.post.description}
                </div>
                <div className="Card-byline u-bold">
                    {"by " + this.props.post.creator_name}
                </div>
            </div>
        );
    }
}

export default Card;
