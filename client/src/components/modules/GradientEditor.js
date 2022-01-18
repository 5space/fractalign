import React, { Component } from "react";
import { hexToRgb, rgbToHex } from "../../utilities.js";

import "../../utilities.css";
import "./GradientEditor.css";

class GradientEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradient: this.props.fractal.gradient
        };
    }

    getGradientStyle() {
        var last = this.state.gradient.at(-1);
        var bg = `linear-gradient(90deg, rgba(${last.color.r},${last.color.g},${last.color.b},1) 0%,`;
        for (let elem of this.state.gradient) {
            let percent = Math.round(100*elem.iter/last.iter);
            bg += `rgba(${elem.color.r},${elem.color.g},${elem.color.b},1) ${percent}%,`;
        }
        bg = bg.slice(0, -1) + ")";
        return {
            background: bg
        };
    }

    updateNthColor(n) {
        return (event) => {
            var grad = this.state.gradient.slice();
            grad[n].color = hexToRgb(event.target.value);
            this.setState({gradient: grad});
        }
    }

    updateNthGradient(n) {
        return (event) => {
            var grad = this.state.gradient.slice();
            grad[n].iter = event.target.value;
            this.setState({gradient: grad});
        }
    }

    getInputItems() {
        var arr = [];
        for (let i = 0; i<this.state.gradient.length; i++) {
            let elem = this.state.gradient[i];
            arr.push(<div className="u-flex" key={`Gradient_${i}`}>
                <div className="GradientEditor-wrapper">
                    <input className="GradientEditor-color" type="color" value={rgbToHex(elem.color)} onChange={this.updateNthColor(i)}></input>
                </div>
                <input className="GradientEditor-iterinput" style={{fontFamily: "inherit"}} type="text" value={elem.iter} onChange={this.updateNthGradient(i)}></input>
            </div>);
        }
        return arr;
    }

    render() {
        return <div className="GradientEditor-container">
            <div className="GradientEditor-gradient u-flex" style={this.getGradientStyle()}></div>
            <div className="GradientEditor-subcontainer u-flex">
                {this.getInputItems()}
            </div>
        </div>;
    }
}

export default GradientEditor;
