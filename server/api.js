const express = require("express");

// import models so we can interact with the database
const Comment = require("./models/comment");
const User = require("./models/user");
const Post = require("./models/post");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.get("/posts", (req, res) => {
    if (req.userId) {
        Post.find({creator_id: req.userid}).then((posts) => res.send(posts));
    } else {
        // empty selector means get all documents
        Post.find({}).then((posts) => res.send(posts));
    }
});

router.post("/post", auth.ensureLoggedIn, (req, res) => {
    const newPost = new Post({
        creator_id: req.user._id,
        creator_name: req.user.name,
        title: req.body.title,
        description: req.body.description,
        timestamp: Date.now(), // prevent clientside timestamp spoofing
        fractal: req.body.fractal
    });

    newPost.save().then((post) => res.send(post));
});

router.get("/post", (req, res) => {
    Post.findById(req.query.postid).then((post) => {
        res.send(post);
    });
});

// TODO: Add comment functionality

// router.get("/comment", (req, res) => {
//     Comment.find({ parent: req.query.parent }).then((comments) => {
//         res.send(comments);
//     });
// });

// router.post("/comment", auth.ensureLoggedIn, (req, res) => {
//     const newComment = new Comment({
//         creator_id: req.user._id,
//         creator_name: req.user.name,
//         parent: req.body.parent,
//         content: req.body.content,
//     });

//     newComment.save().then((comment) => res.send(comment));
// });

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
    if (!req.user) {
        // not logged in
        return res.send({});
    }

    res.send(req.user);
});

router.get("/user", (req, res) => {
    User.findById(req.query.userid).then((user) => {
        res.send(user);
    });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
    console.log(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
