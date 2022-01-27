import React, { Component } from "react";

class NumberParam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "" + this.props.value
        }
    }

    style = {
        fontFamily: "inherit",
        width: "60px",
        height: "18px",
        float: "right"
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: "" + newProps.value});
    }

    render() {
        return <input style={this.style}
                      type="text"
                      value={this.state.value}
                      onChange={(event) => {
                          this.setState({value: event.target.value});
                      }}
                      onBlur={this.props.onChange}>
        </input>
    }
}

export default NumberParam;