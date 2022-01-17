import React, { Component } from "react";
import { lerpColor } from "../../utilities.js";

class FractalRenderer extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.dx = (this.props.fractal.x_max - this.props.fractal.x_min)/this.props.width;
        this.dy = (this.props.fractal.y_max - this.props.fractal.y_min)/this.props.height;
        this.state = {
            fractal: this.props.fractal
        }
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
        return {r: 255, g: 255, b: 255, a: 255};
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

    drawLine(ctx, i) {
        var line = ctx.createImageData(ctx.canvas.width, 1);

        var Y = this.state.fractal.y_min + i * this.dy;
        var X = this.state.fractal.x_min;

        var iter, color;
        var off = 0;

        for (var p = 0; p < ctx.canvas.width; ++p, X += this.dx) {
            iter = this.iterateSingle(X, Y);
            color = (iter >= -1) ? this.getBackgroundColor(iter, this.state.fractal.gradient) : {r:0,g:0,b:0,a:255};
            line.data[off++] = color.r;
            line.data[off++] = color.g;
            line.data[off++] = color.b;
            line.data[off++] = 255;
        }
        
        ctx.putImageData(line, 0, i);
    }

    drawCanvas() {
        var ctx = this.canvasRef.current.getContext("2d");
        for (var i = 0; i < ctx.canvas.height; i++) {
            this.drawLine(ctx, i);
        }
    }

    componentDidMount() {
        this.drawCanvas(this.canvasRef);
    }

    updateFractal(newFractal) {
        this.dx = (this.props.fractal.x_max - this.props.fractal.x_min)/this.props.width;
        this.dy = (this.props.fractal.y_max - this.props.fractal.y_min)/this.props.height;
        this.setState({fractal: newFractal}, () => {
            this.drawCanvas(this.canvasRef);
        });
    }

    render() {
        return <canvas
            className="FractalRenderer-canvas"
            ref={this.canvasRef}
            width={this.props.width}
            height={this.props.height}
        ></canvas>;
    }
};

export default FractalRenderer;
