import React, { Component } from "react";

import "../../utilities.css";
import "./PostSubmit.css";

class PostSubmit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueTitle: "",
            valueDesc: ""
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit && this.props.onSubmit(this.state.valueTitle, this.state.valueDesc);
        // TODO: Temporary to provide user feedback
        document.location.reload();
    };

    handleTitleChange = (event) => {
        this.setState({
            valueTitle: event.target.value,
        });
    };

    handleDescChange = (event) => {
        this.setState({
            valueDesc: event.target.value,
        });
    };
    
    render() {
        return <div className="PostSubmit-container">
            <input
                type="text"
                placeholder="Enter a title..."
                value={this.state.valueTitle}
                onChange={this.handleTitleChange}
                className="PostSubmit-title u-bold"
            />
            <textarea
                type="text"
                placeholder="Enter a description..."
                value={this.state.valueDesc}
                onChange={this.handleDescChange}
                className="PostSubmit-desc"
            />
            <button
                type="submit"
                value="Submit"
                onClick={this.handleSubmit}
                className="PostSubmit-button u-bold">
                Post!
            </button>
        </div>;
    }
}

export default PostSubmit;
