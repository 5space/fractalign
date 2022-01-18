const mongoose = require("mongoose");

// const ParamSchema = new mongoose.Schema({
//     name: String,
//     value: Number
// });

const ColorSchema = new mongoose.Schema({
    iter: Number,
    color: {
        r: Number,
        g: Number,
        b: Number
    }
});

const PostSchema = new mongoose.Schema({
    creator_id: String,
    creator_name: String,
    title: String,
    description: String,
    timestamp: Number,
    fractal: {
        fractalType: String,
        x_min: Number,
        x_max: Number,
        y_min: Number,
        y_max: Number,
        params: Object,
        gradient: [ColorSchema]
    }
});

// compile model from schema
module.exports = mongoose.model("post", PostSchema);
