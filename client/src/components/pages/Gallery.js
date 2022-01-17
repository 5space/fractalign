import React, { Component } from "react";
import Card from "../modules/Card.js";

import { get } from "../../utilities";

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        document.title = "Fractalign | Gallery";
        get("/api/posts").then((postObjs) => {
            let reversed = postObjs.reverse();
            reversed.map((postObj) => {
                this.setState({ posts: this.state.posts.concat([postObj])});
            });
        });
    }

    render() {
        var postsList = <div>No posts! (maybe check back later in case the API is down)</div>;
        if (this.state.posts.length != 0) {
            postsList = this.state.posts.map((postObj) => (
                <Card
                  key={`Card_${postObj._id}`}
                  post={postObj}
                />
            ));
        }
        return <>
            {postsList}
        </>;
    }
}

export default Gallery;
