import React, { Component } from "react";
import { post } from "../../utils_api";
import { defaultFractals } from "../../utils_fractal";

import "../../utilities.css";
import "./Editor.css";
import PostSubmit from "../modules/PostSubmit";
import FractalRenderer from "../modules/FractalRenderer";
import GradientEditor from "../modules/GradientEditor";
import NumberParam from "../modules/NumberParam";

class Editor extends Component {
    constructor(props) {
        super(props);
        this.renderer = React.createRef();
        this.state = {
            fractal: JSON.parse(JSON.stringify(defaultFractals.mandelbrot)),
            gradient: [
                { iter: 10, color: {r:0, g:45, b:102} },
                { iter: 20, color: {r:0, g:165, b:194} },
                { iter: 40, color: {r:45, g:0, b:92} },
                { iter: 60, color: {r:0, g:0, b:64} }
            ]
        }
    }

    handleSubmit = (title, desc) => {
        const body = {
            title: title,
            description: desc,
            fractal: this.state.fractal,
            gradient: this.state.gradient
        };
        post("/api/post", body).then((postObj) => {
            window.open("/post/" + postObj._id);
        });
    }

    // callbacks
    resetFractal = (type) => {
        type ||= this.state.fractal.fractalType;
        this.setState({fractal: JSON.parse(JSON.stringify(defaultFractals[type]))}, () => {
            this.renderer.current.drawCanvas();
        });
    }

    updateFractal = (fractalObj, callback) => {
        this.setState({fractal: fractalObj}, callback);
    }

    updateGradient = (gradientObj) => {
        this.setState({gradient: gradientObj});
    }

    updateParam(key, subkey) {
        return (event) => {
            var obj = {...this.state.fractal};
            var val = parseFloat(event.target.value);
            if (!isNaN(val)) {
                if (subkey != undefined) obj.params[key][subkey] = val;
                else obj.params[key] = val;
                this.setState({fractal: obj});
            }
            event.target.value = "" + (subkey === undefined ? obj.params[key] : obj.params[key][subkey]);
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

    updateType = (event) => {
        var newFrac = JSON.parse(JSON.stringify(defaultFractals[event.target.value]));
        this.setState({fractal: newFrac}, () => {
            this.renderer.current.drawCanvas();
        });
    }

    componentDidMount() {
        document.title = "Fractalign | Editor";
    }

    getParamsList() {
        var paramsList = [];
        for (var key of Object.keys(this.state.fractal.params)) {
            if (Array.isArray(this.state.fractal.params[key])) { // support for coordinate parameters
                paramsList.push(<div className="Editor-singleparam u-flex">
                    <label>{key}</label>
                    <div className="u-flex">
                        <NumberParam value={this.state.fractal.params[key][0]} onChange={this.updateParam(key, 0)}/>
                        <NumberParam value={this.state.fractal.params[key][1]} onChange={this.updateParam(key, 1)}/>
                    </div>
                </div>);
            } else {
                paramsList.push(<div className="Editor-singleparam u-flex">
                    <label>{key}</label>
                    <NumberParam value={this.state.fractal.params[key]} onChange={this.updateParam(key)}/>
                </div>);
            }
        }
        return paramsList;
    }
    
    render() {
        return <>
            <div className="Editor-container">
                <FractalRenderer className="Editor-fractal" ref={this.renderer} fractal={this.state.fractal} gradient={this.state.gradient} updateFractal={this.updateFractal} updateGradient={this.updateGradient} width="720" height="540"/>
                <GradientEditor className="Editor-gradient" gradient={this.state.gradient} onChange={this.updateGradient}/>
                <div className="Editor-subcontainer">
                    <div className="Editor-singleparam u-flex">
                        <label>Type</label>
                        <select style={{fontFamily: "inherit", width: "136px"}} value={this.state.fractal.fractalType} onChange={this.updateType}>
                            <option value="mandelbrot">Mandelbrot</option>
                            <option value="julia">Julia</option>
                            <option value="newton">Newton</option>
                            <option value="burningship">Burning Ship</option>
                            <option value="mandelbox">Mandelbox</option>
                            <option value="rational">Rational Map</option>
                        </select>
                    </div>
                    <br/>
                    <div className="Editor-singleparam u-flex">
                        <label>X</label>
                        <div className="u-flex">
                            <NumberParam value={this.state.fractal.x_min} onChange={this.updateCoord("x_min")}/>
                            <NumberParam value={this.state.fractal.x_max} onChange={this.updateCoord("x_max")}/>
                        </div>
                    </div>
                    <div className="Editor-singleparam u-flex">
                        <label>Y</label>
                        <div className="u-flex">
                            <NumberParam value={this.state.fractal.y_min} onChange={this.updateCoord("y_min")}/>
                            <NumberParam value={this.state.fractal.y_max} onChange={this.updateCoord("y_max")}/>
                        </div>
                    </div>
                    <br></br>
                    <label className="u-bold">Options:</label>
                    {this.getParamsList()}
                </div>
                <div className="Editor-buttonpanel u-flex">
                    <button className="Editor-renderbutton u-bold" type="submit" onClick={() => this.renderer.current.drawCanvas()}>
                        Render
                    </button>
                    <button className="Editor-resetbutton u-bold" type="submit" onClick={() => this.resetFractal()}>
                        Reset
                    </button>
                </div>
            </div>
            {this.props.userId ? <PostSubmit onSubmit={this.handleSubmit}/> : null}
            <div className="Editor-help">
                <h3>Confused? Read this first!</h3>
                <p>
                    Fractals are mathematical shapes that are infinitely complex, so you can keep zooming in on the image above and find more detail!
                </p>
            </div>
        </>;
    }
}

export default Editor;
