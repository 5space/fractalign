import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities.js";
import FractalRenderer from "../modules/FractalRenderer.js";

import "../../utilities.css";
import "./SinglePost.css";

class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.userId,
            post: undefined
        }
    }

    componentDidMount() {
        get("/api/post", {postid: this.props.postId}).then((postObj) => {
            this.setState({post: postObj});
        });
    }

    render() {
        return <>
            {this.state.post ?
            <div className="SinglePost-container">
                <FractalRenderer className="SinglePost-fractal" fractal={this.state.post.fractal} width="800" height="600"/>
                <br/>
                <span className="SinglePost-title u-bold">{this.state.post.title} · <Link to={"/profile/" + this.state.post.creator_id}>
                    {this.state.post.creator_name}
                </Link> · {new Date(this.state.post.timestamp).toLocaleString()}</span>
                <p className="SinglePost-description">{this.state.post.description}</p>
            </div>
            : <label>Loading...</label>}
        </>;
    }
}

export default SinglePost;