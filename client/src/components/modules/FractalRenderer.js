import React, { Component } from "react";
import { lerpColor, iterateSingle } from "../../utils_fractal";

class FractalRenderer extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.allowDrag = this.props.allowDrag || this.props.allowDrag === undefined;

        this.img = undefined;
        this.rectx1 = undefined;
        this.recty1 = undefined;
        this.rectx2 = undefined;
        this.recty2 = undefined;
        this.dragging = false;
    }

    getBackgroundColor(iter) {
        var elem1, elem2;
        var len = this.props.gradient.length;

        // allows the gradient to wrap around
        if (iter >= 0) {
            iter %= this.props.gradient[len-1].iter;
        }

        if (iter <= 0) {
            return this.props.gradient[len-1].color;
        } else if (iter <= this.props.gradient[0].iter) {
            elem1 = this.props.gradient[len-1];
            elem2 = this.props.gradient[0];
            return lerpColor(elem1.color, elem2.color, iter/elem2.iter);
        }

        for (var i=1; i<len; i++) {
            elem1 = this.props.gradient[i-1];
            elem2 = this.props.gradient[i];
            if (elem1.iter <= iter && iter < elem2.iter) {
                return lerpColor(elem1.color, elem2.color, (iter - elem1.iter)/(elem2.iter - elem1.iter));
            } else if (iter == elem2.iter) {
                return elem2.color;
            }
        }

        // this shouldn't happen, but in case it does
        return {r: 255, g: 255, b: 255};
    }

    drawCanvas() {
        var ctx = this.canvasRef.current.getContext("2d");
        this.img = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);

        var Y = this.props.fractal.y_min;
        var X = this.props.fractal.x_min;
        var off = 0;
        var iter, color;

        var dx = (this.props.fractal.x_max - this.props.fractal.x_min)/this.props.width;
        var dy = (this.props.fractal.y_max - this.props.fractal.y_min)/this.props.height;

        for (var cy = 0; cy < ctx.canvas.height; cy++, Y += dy) {

            var X = this.props.fractal.x_min;
    
            for (var cx = 0; cx < ctx.canvas.width; cx++, X += dx) {
                iter = iterateSingle[this.props.fractal.fractalType](this.props.fractal, X, Y);
                color = (isNaN(iter)) ? {r:0,g:0,b:0} : this.getBackgroundColor(iter);
                this.img.data[off++] = color.r;
                this.img.data[off++] = color.g;
                this.img.data[off++] = color.b;
                this.img.data[off++] = 255;
            }
        }
        
        this.img && ctx.putImageData(this.img, 0, 0);
    }

    drawCanvasAsync() {
        setTimeout(function(){ 
            this.drawCanvas();
        }.bind(this), 0);
    }

    componentDidMount() {
        this.drawCanvasAsync();
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

        var newFrac = {...this.props.fractal};
        var width = newFrac.x_max - newFrac.x_min;
        var height = newFrac.y_max - newFrac.y_min;

        newFrac.x_max = newFrac.x_min + width * Math.max(this.rectx1, this.rectx2)/this.props.width;
        newFrac.x_min += width * Math.min(this.rectx1, this.rectx2)/this.props.width;

        newFrac.y_max = newFrac.y_min + height * Math.max(this.recty1, this.recty2)/this.props.height;
        newFrac.y_min += height * Math.min(this.recty1, this.recty2)/this.props.height;

        this.props.updateFractal && this.props.updateFractal(newFrac, (() => this.drawCanvasAsync()).bind(this));
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
        if (this.allowDrag) {
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
        } else {            
            return <canvas
                className="FractalRenderer-canvas"
                ref={this.canvasRef}
                width={this.props.width}
                height={this.props.height}
            ></canvas>;
        }
    }
};

export default FractalRenderer;
