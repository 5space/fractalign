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
                <FractalRenderer allowDrag={false} fractal={this.props.post.fractal} gradient={this.props.post.gradient} width="240" height="180"/>
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
