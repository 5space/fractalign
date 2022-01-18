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
                        iter: 0,
                        color: {r:0, g:0, b:64}
                    },
                    {
                        iter: 20,
                        color: {r:255, g:160, b:0}
                    },
                    {
                        iter: 40,
                        color: {r:255, g:0, b:0}
                    },
                    {
                        iter: 60,
                        color: {r:144, g:24, b:100}
                    },
                    {
                        iter: 256,
                        color: {r:0, g:128, b:255}
                    }
                ]
            }
        };
    }

    handleSubmit = (title, desc) => {
        const body = {
            title: title,
            description: desc,
            fractal: this.state.fractal
        };
        post("/api/post", body).then((postObj) => {
            window.open("/post/" + postObj._id);
        });
    }

    // callbacks
    updateFractal = (fractalObj) => {
        this.setState({fractal: fractalObj});
        this.updateRenderer(fractalObj);
    }

    updateRenderer = (fractalObj) => {
        this.renderer.current.updateFractal(fractalObj);
    }

    updateParam(key) {
        return (event) => {
            var obj = {...this.state.fractal};
            if (typeof(obj.params[key]) === "number") {
                var val = parseFloat(event.target.value);
                if (!isNaN(val)) {
                    obj.params[key] = val;
                    this.setState({fractal: obj});
                }
            } else {
                obj.params[key] = event.target.value;
                this.setState({fractal: obj});
            }
            event.target.value = "" + obj.params[key];
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
            event.target.value = "" + obj[key];
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
                <input className="Editor-paraminput" style={{fontFamily: "inherit"}} type="text" defaultValue={value} onBlur={this.updateParam(key)}></input>
            </div>);
        }
        return paramsList;
    }

    render() {
        return <>
            <div className="Editor-container">
                <FractalRenderer className="Editor-fractal" ref={this.renderer} fractal={this.state.fractal} updateFractal={this.updateFractal} width="720" height="540"/>
                <GradientEditor className="Editor-gradient" fractal={this.state.fractal} onChange={this.updateRenderer}/>
                <div className="Editor-subcontainer">
                    <div className="Editor-singleparam u-flex">
                        <label>X</label>
                        <div className="u-flex">
                            <input className="Editor-paraminput" style={{fontFamily: "inherit"}} type="text" defaultValue={this.state.fractal.x_min} onBlur={this.updateCoord("x_min")}></input>
                            <input className="Editor-paraminput" style={{fontFamily: "inherit"}} type="text" defaultValue={this.state.fractal.x_max} onBlur={this.updateCoord("x_max")}></input>
                        </div>
                    </div>
                    <div className="Editor-singleparam u-flex">
                        <label>Y</label>
                        <div className="u-flex">
                            <input className="Editor-paraminput" style={{fontFamily: "inherit"}} type="text" defaultValue={this.state.fractal.y_min} onBlur={this.updateCoord("y_min")}></input>
                            <input className="Editor-paraminput" style={{fontFamily: "inherit"}} type="text" defaultValue={this.state.fractal.y_max} onBlur={this.updateCoord("y_max")}></input>
                        </div>
                    </div>
                    <br></br>
                    <label className="u-bold">Parameters</label>
                    {this.getParamsList()}
                </div>
                <button className="Editor-renderbutton u-bold" type="submit" onClick={() => {this.renderer.current.updateFractal(this.state.fractal);}}>
                    Render
                </button>
            </div>
            {this.props.userId ? <PostSubmit onSubmit={this.handleSubmit}/> : null}
        </>;
    }
}

export default Editor;
