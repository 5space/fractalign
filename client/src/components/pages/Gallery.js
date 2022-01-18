import React, { Component } from "react";
import Card from "../modules/Card.js";

import { get } from "../../utilities";
import "./Gallery.css";

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
        if (this.state.posts.length == 0) {
            return <div>No posts! (maybe check back later in case the API is down)</div>
        }
        var i = 0;
        var postsList = this.state.posts.map((postObj) => (
            <Card
                key={`Card_${postObj._id}`}
                post={postObj}
                style={{
                    gridColumn: (i % 4) + 1, // 1-indexed
                    gridRow: (i++ >> 2) + 1
                }}
            />
        ));
        return <div className="Gallery-container">
            <h1 className="u-textCenter">Posts</h1>
            <hr/>
            <div className="Gallery-subcontainer">
                {postsList}
            </div>
        </div>;
    }
}

export default Gallery;
