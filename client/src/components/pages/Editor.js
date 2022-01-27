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
            this.renderer.current.drawCanvasAsync();
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
            this.renderer.current.drawCanvasAsync();
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
        return <div className="Editor-container u-flexColumn">
            <div className="Editor-editor">
                <FractalRenderer className="Editor-fractal" title="Drag me to select a box!" ref={this.renderer} fractal={this.state.fractal} gradient={this.state.gradient} updateFractal={this.updateFractal} updateGradient={this.updateGradient} width="720" height="540"/>
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
                    <button className="Editor-renderbutton u-bold" title="Refresh the fractal" type="submit" onClick={() => this.renderer.current.drawCanvasAsync()}>
                        Render
                    </button>
                    <button className="Editor-resetbutton u-bold" title="Reset if you get lost" type="submit" onClick={() => this.resetFractal()}>
                        Reset
                    </button>
                </div>
            </div>
            {this.props.userId ? <PostSubmit onSubmit={this.handleSubmit}/> : null}
            <div className="Editor-help">
                <h3>Confused? Read this first!</h3>
                <p>
                    Fractals are mathematical shapes that are infinitely complex, so you can keep zooming in on the image above and find more detail!<br/>
                    The editor above lets you zoom in and tweak a few different fractals, including Mandelbrot, Julia, Newton, Burning Ship, Mandelbox, and the Rational Map.<br/>
                    It also lets you change the color gradient and the parameters of the fractal.<br/>
                    You can also save your fractal and share it with others!<br/>
                    <br/>
                    <b>How to use the editor:</b><br/>
                    <br/>
                    <b>Zooming:</b><br/>
                    Drag a box to select a region of the fractal to zoom in on. You can also hit the "Reset" button to reset the zoom, or manually change the coordinates.<br/>
                    <br/>
                    <b>Changing fractal:</b><br/>
                    Select a fractal from the dropdown menu above.<br/>
                    <br/>
                    <b>Changing color gradient:</b><br/>
                    Click each color to change the gradient's color palette. The number next to each color shows the number of iterations it takes to reach that color, and the pattern repeats from 0 after it reaches the last color.<br/>
                    <br/>
                    <b>Changing parameters:</b><br/>
                    Some of the parameters are self explanatory:
                    <ul>
                        <li>
                            <b>x_min</b> and <b>x_max</b> are the x-coordinates of the top-left and bottom-right corners of the box you're zooming in on.
                        </li>
                        <li>
                            <b>y_min</b> and <b>y_max</b> are the y-coordinates of the top-left and bottom-right corners of the box you're zooming in on.
                        </li>
                        <li>
                            <b>iterations</b> is the number of iterations the fractal will run before it stops (the level of detail).
                        </li>
                        <li>
                            <b>bulbs</b> is the number of bulbs the Mandelbrot set will have (default: 1).
                        </li>
                    </ul>
                    <br/>
                    If you're having trouble, try the "Render" button to see if it works!<br/>
                    <br/>
                </p>
            </div>
        </div>;
    }
}

export default Editor;
