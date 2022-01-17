import React, { Component } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Gallery from "./pages/Gallery.js";
import Profile from "./pages/Profile.js";
import Editor from "./pages/Editor.js";

import { get, post } from "../utilities";

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
    // makes props available in this component
    constructor(props) {
        super(props);
        this.state = {
            userId: undefined,
        };
    }

    componentDidMount() {
        get("/api/whoami").then((user) => {
            if (user._id) {
                // they are registed in the database, and currently logged in.
                this.setState({ userId: user._id });
            }
        });
    }

    handleLogin = (res) => {
        console.log(`Logged in as ${res.profileObj.name}`);
        const userToken = res.tokenObj.id_token;
        post("/api/login", { token: userToken }).then((user) => {
            this.setState({ userId: user._id });
        });
    };

    handleLogout = () => {
        this.setState({ userId: undefined });
        post("/api/logout");
    };

    // required method: whatever is returned defines what
    // shows up on screen
    render() {
        return (
            <>
                <NavBar
                    handleLogin={this.handleLogin}
                    handleLogout={this.handleLogout}
                    userId={this.state.userId}
                />
                <div className="App-container">
                    <Router>
                        <Gallery path="/" userId={this.state.userId} />
                        <Profile path="/profile/:userId" />
                        <Editor path="/editor/" userId={this.state.userId} />
                        {/* <SinglePost path="/post/:postId" /> */}
                        <NotFound default />
                    </Router>
                </div>
            </>
        );
    }
}

export default App;
