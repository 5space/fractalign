import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./NavBar.css";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "578078860492-4ertv7n7l61g654tjfok94cj5ovua9bj.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="NavBar-container">
                <div className="NavBar-title u-inlineBlock">Fractalign</div>
                <div className="NavBar-linkContainer u-inlineBlock">
                    <Link to="/" className="NavBar-link">
                        Dashboard
                    </Link>
                    <Link to="/editor/" className="NavBar-link">
                        Editor
                    </Link>
                    {this.props.userId && (
                        <Link to={`/profile/${this.props.userId}`} className="NavBar-link">
                            Profile
                        </Link>
                    )}
                    {this.props.userId ? (
                        <GoogleLogout
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Logout"
                            onLogoutSuccess={this.props.handleLogout}
                            onFailure={(err) => console.log(err)}
                            className="NavBar-link NavBar-login"
                        />
                    ) : (
                        <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Login"
                            onSuccess={this.props.handleLogin}
                            onFailure={(err) => console.log(err)}
                            className="NavBar-link NavBar-login"
                        />
                    )}
                </div>
            </nav>
        );
    }
}

export default NavBar;
