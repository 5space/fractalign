import React, { Component } from "react";
import { Link } from "@reach/router";
import { get } from "../../utils_api";
import FractalRenderer from "../modules/FractalRenderer";

import "../../utilities.css";
import "./SinglePost.css";

class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.userId,
            post: undefined,
            comments: undefined
        }
    }

    componentDidMount() {
        get("/api/post", {post_id: this.props.postId}).then((postObj) => {
            this.setState({post: postObj});
            get("/api/comments", {post_id: postObj._id}).then((commentObjs) => {
                this.setState({comments: commentObjs});
            });
        });
    }

    getCommentsDisplay() {
        if (!this.comments) return <span>No Comments</span>;

        var commentsArr = [];
        for (var comment of this.state.comments) {
            console.log(comment);
        }
        
        return <>
            <span>Comments</span>
            {commentsArr}
        </>;
    }

    render() {
        return <>
            {this.state.post ?
            <div className="SinglePost-container">
                <FractalRenderer className="SinglePost-fractal" allowDrag={false} fractal={this.state.post.fractal} gradient={this.state.post.gradient} width="800" height="600"/>
                <br/>
                <span className="SinglePost-title u-bold">{this.state.post.title} · <Link to={"/profile/" + this.state.post.creator_id}>
                    {this.state.post.creator_name}
                </Link> · {new Date(this.state.post.timestamp).toLocaleString()}</span>
                <p className="SinglePost-description">{this.state.post.description}</p>
                <hr/>
                {this.getCommentsDisplay()}
            </div>
            : <span>Loading...</span>}
        </>;
    }
}

export default SinglePost;