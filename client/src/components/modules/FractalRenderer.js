import React, { Component } from "react";
import { lerpColor } from "../../utilities.js";

class FractalRenderer extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            fractal: this.props.fractal
        }

        this.img = undefined;
        this.rectx1 = undefined;
        this.recty1 = undefined;
        this.rectx2 = undefined;
        this.recty2 = undefined;
        this.dragging = false;
    }

    getBackgroundColor(iter, gradient) {
        var elem1, elem2;
        var len = gradient.length;

        if (iter <= gradient[0].iter) {
            return gradient[0].color;
        } else if (iter >= gradient[len-1].iter) {
            return gradient[len-1].color;
        }

        for (let i = 1; i<len; i++) {
            elem1 = gradient[i-1];
            elem2 = gradient[i];
            if (elem1.iter <= iter && iter < elem2.iter) {
                return lerpColor(elem1.color, elem2.color, (iter - elem1.iter)/(elem2.iter - elem1.iter));
            } else if (iter == elem2.iter) {
                return elem2.color;
            }
        }

        // this shouldn't happen, but in case it does
        return {r: 255, g: 255, b: 255};
    }

    iterateSingle(re, im) {
        var iter = 0;

        var x = 0;
        var y = 0;
        var B = 256;

        var MAX_ITER = this.props.fractal.params.iterations;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {
            var xTemp = x * x - y * y + re;
            y = 2 * x * y + im;
            x = xTemp;
            iter++;
        }
        
        if (iter == MAX_ITER) return -2;
        else {
            return iter - Math.log(Math.log(x*x + y*y))/Math.log(2.0);
        }
    }

    drawCanvas() {
        var ctx = this.canvasRef.current.getContext("2d");
        this.img = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

        var Y = this.state.fractal.y_min;
        var X = this.state.fractal.x_min;
        var off = 0;
        var iter, color;

        var dx = (this.state.fractal.x_max - this.state.fractal.x_min)/this.props.width;
        var dy = (this.state.fractal.y_max - this.state.fractal.y_min)/this.props.height;

        for (var cy = 0; cy < ctx.canvas.height; cy++, Y += dy) {

            var X = this.state.fractal.x_min;
    
            for (var cx = 0; cx < ctx.canvas.width; cx++, X += dx) {
                iter = this.iterateSingle(X, Y);
                color = (iter >= -1) ? this.getBackgroundColor(iter, this.state.fractal.gradient) : {r:0,g:0,b:0};
                this.img.data[off++] = color.r;
                this.img.data[off++] = color.g;
                this.img.data[off++] = color.b;
                this.img.data[off++] = 255;
            }
        }
        
        this.img && ctx.putImageData(this.img, 0, 0);
    }

    componentDidMount() {
        this.drawCanvas(this.canvasRef);
    }

    updateFractal(newFractal) {
        this.setState({fractal: newFractal}, () => {
            this.drawCanvas(this.canvasRef);
        });
    }

    mouseDown = (e) => {
        if (!this.img) return;
        this.dragging = true;
        this.rectx1 = this.rectx2 = e.nativeEvent.offsetX;
        this.recty1 = this.recty2 = e.nativeEvent.offsetY;
    }

    mouseMove = (e) => {
        if (!this.img) return;
        if (this.dragging) {
            var ctx = this.canvasRef.current.getContext("2d");
            this.rectx2 = e.nativeEvent.offsetX;
            this.recty2 = e.nativeEvent.offsetY;
            ctx.putImageData(this.img, 0, 0);
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.rectx1, this.recty1, this.rectx2 - this.rectx1, this.recty2 - this.recty1);
        }
    }

    mouseUp = (e) => {
        if (!this.img) return;
        if (this.rectx1 === this.rectx2 || this.recty1 === this.recty2) {
            this.mouseOut();
            return;
        }

        var newFrac = {...this.state.fractal};
        var width = newFrac.x_max - newFrac.x_min;
        var height = newFrac.y_max - newFrac.y_min;

        newFrac.x_max = newFrac.x_min + width * Math.max(this.rectx1, this.rectx2)/this.props.width;
        newFrac.x_min += width * Math.min(this.rectx1, this.rectx2)/this.props.width;

        newFrac.y_max = newFrac.y_min + height * Math.max(this.recty1, this.recty2)/this.props.height;
        newFrac.y_min += height * Math.min(this.recty1, this.recty2)/this.props.height;

        // This will propagate back to the renderer and work anyway
        this.props.updateFractal && this.props.updateFractal(newFrac);
        this.mouseOut();
    }

    mouseOut = (e) => {
        this.rectx = undefined;
        this.recty = undefined;
        this.dragging = false;
        var ctx = this.canvasRef.current.getContext("2d");
        ctx.putImageData(this.img, 0, 0);
    }

    render() {
        return <canvas
            className="FractalRenderer-canvas"
            ref={this.canvasRef}
            width={this.props.width}
            height={this.props.height}
            onMouseDown={this.mouseDown}
            onMouseMove={this.mouseMove}
            onMouseUp={this.mouseUp}
            onMouseOut={this.mouseOut}
        ></canvas>;
    }
};

export default FractalRenderer;
