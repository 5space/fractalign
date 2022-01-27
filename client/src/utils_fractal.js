export function lerpColor(a, b, amount) {
    var rr = Math.round(a.r + amount * (b.r - a.r));
    var rg = Math.round(a.g + amount * (b.g - a.g));
    var rb = Math.round(a.b + amount * (b.b - a.b));
    return {r: rr, g: rg, b: rb};
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
export function rgbToHex(c) {
    return "#" + componentToHex(c.r) + componentToHex(c.g) + componentToHex(c.b);
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const defaultFractals = {
    
    mandelbrot: {
        fractalType: "mandelbrot",
        x_min: -2,
        x_max: 2,
        y_min: -1.5,
        y_max: 1.5,
        params: {
            iterations: 256,
            bulbs: 1
        }
    },

    julia: {
        fractalType: "julia",
        x_min: -2,
        x_max: 2,
        y_min: -1.5,
        y_max: 1.5,
        params: {
            iterations: 256,
            bulbs: 1,
            c: [0.36, 0.1]
        }
    },

    newton: {
        fractalType: "newton",
        x_min: -2,
        x_max: 2,
        y_min: -1.5,
        y_max: 1.5,
        params: {
            iterations: 256,
            n: 3
        }
    },

    burningship: {
        fractalType: "burningship",
        x_min: -2.1,
        x_max: 1.5,
        y_min: -2,
        y_max: 0.7,
        params: {
            iterations: 256,
            bulbs: 1
        }
    },

    mandelbox: {
        fractalType: "mandelbox",
        x_min: -2,
        x_max: 2,
        y_min: -1.5,
        y_max: 1.5,
        params: {
            iterations: 256,
            scale: 2,
            inner_radius: 0.9,
            outer_radius: 1,
            boxsize: 1
        }
    },

    rational: {
        fractalType: "rational",
        x_min: -2,
        x_max: 2,
        y_min: -1.5,
        y_max: 1.5,
        params: {
            iterations: 256,
            p: 2,
            q: 2,
            lambda: 0.0625,
            c: [0, 0]
        }
    }
};

export const iterateSingle = {

    mandelbrot: (frac, re, im) => {
        var iter = 0;

        var x = 0;
        var y = 0;
        var B = 256;

        var MAX_ITER = frac.params.iterations;
        var bulbs = frac.params.bulbs;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {
            var x1 = x, y1 = y;
            for (var i = 0; i<bulbs; i++) {
                var xTemp = x * x1 - y * y1;
                y = x1 * y + x * y1;
                x = xTemp;
            }
            x += re;
            y += im;
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter - Math.log(Math.log(x*x + y*y))/Math.log(bulbs + 1);
        }
    },

    julia: (frac, re, im) => {
        var iter = 0;

        var x = re;
        var y = im;
        var B = 256;

        var MAX_ITER = frac.params.iterations;
        var bulbs = frac.params.bulbs;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {
            var x1 = x, y1 = y;
            for (var i = 0; i<bulbs; i++) {
                var xTemp = x * x1 - y * y1;
                y = x1 * y + x * y1;
                x = xTemp;
            }
            x += frac.params.c[0];
            y += frac.params.c[1];
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter - Math.log(Math.log(x*x + y*y))/Math.log(bulbs + 1);
        }
    },

    newton: (frac, re, im) => {
        var iter = 0;

        var x = re;
        var y = im;

        var MAX_ITER = frac.params.iterations || 256;
        var tolerance = 0.001;

        function check() {
            return Math.min((x-1)**2 + y**2,
                            (x+0.5)**2 + (y-0.866025404)**2,
                            (x+0.5)**2 + (y+0.866025404)**2);
        }
        
        while (check() > tolerance && iter < MAX_ITER) {
            var xTemp = 2/3 * x + 1/3 * (x*x - y*y)/(x*x + y*y)**2;
            y = 2/3 * y - 1/3 * (2*x*y)/(x*x + y*y)**2;
            x = xTemp;
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter - Math.log2(Math.log(check()) / Math.log(tolerance));
        }
    },

    burningship: (frac, re, im) => {
        var iter = 0;

        var x = 0;
        var y = 0;
        var B = 256;

        var MAX_ITER = frac.params.iterations;
        var bulbs = frac.params.bulbs;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {
            var x1 = Math.abs(x), y1 = Math.abs(y);
            var x = x1, y = y1;
            for (var i = 0; i<bulbs; i++) {
                var xTemp = x * x1 - y * y1;
                y = x1 * y + x * y1;
                x = xTemp;
            }
            x += re;
            y += im;
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter - Math.log(Math.log(x*x + y*y))/Math.log(bulbs + 1);
        }
    },

    mandelbox: (frac, re, im) => {
        var iter = 0;

        var x = 0;
        var y = 0;
        var B = 256;

        var MAX_ITER = frac.params.iterations;
        var boxsize = frac.params.boxsize;
        var ir = frac.params.inner_radius;
        var or = frac.params.outer_radius;
        var scale = frac.params.scale;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {

            if (x > boxsize) {
                x = 2*boxsize - x;
            } else if (x < -boxsize) {
                x = -2*boxsize - x;
            }

            if (y > boxsize) {
                y = 2*boxsize - y;
            } else if (y < -boxsize) {
                y = -2*boxsize - y;
            }

            var r2 = x*x + y*y;
            if (r2 < ir*ir) {
                x *= 4;
                y *= 4;
            } else if (r2 < or*or) {
                x /= r2;
                y /= r2;
            }

            x = scale * x + re;
            y = scale * y + im;
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter;
        }
    },

    rational: (frac, re, im) => {
        var iter = 0;

        var x = re;
        var y = im;
        var B = 256;

        var MAX_ITER = frac.params.iterations;
        var p = frac.params.p;
        var q = frac.params.q;
        var l = frac.params.lambda;

        while (x*x + y*y <= B*B && iter < MAX_ITER) {
            var x1 = x,
                y1 = y,
                xp = x,
                yp = y,
                xq = x,
                yq = y;
            
            for (var i = 0; i<p-1; i++) {
                var xTemp = xp * x1 - yp * y1;
                yp = x1 * yp + xp * y1;
                xp = xTemp;
            }

            for (var i = 0; i<q-1; i++) {
                var xTemp = xq * x1 - yq * y1;
                yq = x1 * yq + xq * y1;
                xq = xTemp;
            }

            x = xp - l * xq / (x1*x1 + y1*y1)**q;
            y = yp + l * yq / (x1*x1 + y1*y1)**q;

            x += frac.params.c[0];
            y += frac.params.c[1];
            iter++;
        }
        
        if (iter == MAX_ITER) return NaN;
        else {
            return iter - Math.log(Math.log(x*x + y*y))/Math.log(p);
        }
    }
};