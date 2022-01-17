import React, { Component } from "react";
import { post } from "../../utilities.js";

import "../../utilities.css";
import "./Editor.css";
import PostSubmit from "../modules/PostSubmit.js";
import FractalRenderer from "../modules/FractalRenderer.js";
import GradientEditor from "../modules/GradientEditor.js";

class Editor extends Component {
    constructor(props) {
        super(props);
        this.renderer = React.createRef();
        this.state = {
            user: undefined,
            fractal: {
                fractalType: "mandelbrot",
                x_min: -2,
                x_max: 2,
                y_min: -2,
                y_max: 2,
                params: {
                    n: 2,
                    iterations: 256
                },
                gradient: [
                    {
                        iter: 10,
                        color: {r:0, g:0, b:0, a:1}
                    },
                    {
                        iter: 20,
                        color: {r:255, g:0, b:0, a:1}
                    },
                    {
                        iter: 30,
                        color: {r:0, g:0, b:0, a:1}
                    },
                    {
                        iter: 40,
                        color: {r:0, g:0, b:0, a:1}
                    }
                ]
            },
        };
    }

    handleSubmit = (title, desc) => {
        const body = {
            title: title,
            description: desc,
            fractal: this.state.fractal
        };
        post("/api/post", body);
    }

    // callback
    updateFractal(fractalObj) {
        this.renderer.updateFractal(fractalObj);
    }

    updateParam(key) {
        return (event) => {
            var obj = {...this.state.fractal};
            if (typeof(obj.params[key]) === "number") {
                obj.params[key] = parseFloat(event.target.value);
            } else {
                obj.params[key] = event.target.value;
            }
            this.setState({fractal: obj});
        }
    }

    updateCoord(key) {
        return (event) => {
            var obj = {...this.state.fractal};
            var val = parseFloat(event.target.value);
            if (!isNaN(val)) {
                obj[key] = val;
                this.setState({fractal: obj});
            }
        }
    }

    componentDidMount() {
        document.title = "Fractalign | Editor";
    }

    getParamsList() {
        var paramsList = [];
        var key, value;
        for (key of Object.keys(this.state.fractal.params)) {
            value = this.state.fractal.params[key];
            paramsList.push(<div className="Editor-singleparam u-flex">
                <label>{key}</label>
                <input className="Editor-paraminput" type="text" value={value} onChange={this.updateParam(key)}></input>
            </div>);
        }
        return paramsList;
    }

    render() {
        return <div>
            <div className="Editor-container">
                <FractalRenderer className="Editor-fractal" ref={this.renderer} fractal={this.state.fractal} width="720" height="540"/>
                <GradientEditor className="Editor-gradient" fractal={this.state.fractal} onChange={this.updateFractal}/>
                <div className="Editor-subcontainer">
                    <div className="Editor-singleparam u-flex">
                        <label>X</label>
                        <div className="u-flex">
                            <input className="Editor-paraminput" type="text" value={this.state.fractal.x_min} onChange={this.updateCoord("x_min")}></input>
                            <input className="Editor-paraminput" type="text" value={this.state.fractal.x_max} onChange={this.updateCoord("x_max")}></input>
                        </div>
                    </div>
                    <div className="Editor-singleparam u-flex">
                        <label>Y</label>
                        <div className="u-flex">
                            <input className="Editor-paraminput" type="text" value={this.state.fractal.y_min} onChange={this.updateCoord("y_min")}></input>
                            <input className="Editor-paraminput" type="text" value={this.state.fractal.y_max} onChange={this.updateCoord("y_max")}></input>
                        </div>
                    </div>
                    <br></br>
                    <label className="u-bold">Parameters</label> 
                    {this.getParamsList()}
                </div>
                <button className="Editor-renderbutton" type="submit" onClick={() => {this.renderer.current.updateFractal(this.state.fractal);}}>
                    Render
                </button>
            </div>
            <PostSubmit onSubmit={this.handleSubmit}/>
        </div>;
    }
}

export default Editor;
