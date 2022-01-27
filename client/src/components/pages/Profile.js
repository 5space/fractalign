import React, { Component } from "react";
import { get } from "../../utils_api";
import Card from "../modules/Card";

import "../../utilities.css";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            posts: []
        };
    }

    componentDidMount() {
        document.title = "Fractalign | Profile";
        get("/api/user", { user_id: this.props.userId }).then((user) => this.setState({ user: user }));
        get("/api/posts", { user_id: this.props.userId }).then((postObjs) => {
            let reversed = postObjs.reverse();
            reversed.map((postObj) => {
                this.setState({ posts: this.state.posts.concat([postObj])});
            });
        });
    }

    render() {
        if (!this.state.user) {
            return <div>Loading...</div>;
        }

        var postsList = <div>No posts! (maybe check back later in case the API is down)</div>;
        if (this.state.posts.length != 0) {
            postsList = this.state.posts.map((postObj) => (
                <Card
                  key={`Card_${postObj._id}`}
                  post={postObj}
                />
            ));
        }

        return (
            <div className="Profile-container">
                <h1 className="Profile-name u-textCenter">{this.state.user.name}</h1>
                <hr/>
                <div className="Profile-subcontainer">
                    {postsList}
                </div>
            </div>
        );
    }
}

export default Profile;
