const validator = require("./validator");
validator.checkSetup();

const http = require("http");
const bodyParser = require("body-parser"); // allow node to automatically parse POST body requests as JSON
const express = require("express"); // backend framework for our node server.
const session = require("express-session"); // library that stores info about each connected user
const mongoose = require("mongoose"); // library to connect to MongoDB
const path = require("path"); // provide utilities for working with file and directory paths

const api = require("./api");
const auth = require("./auth");

require("dotenv").config();

// Server configuration below
// TODO change connection URL after setting up your own database
const mongoConnectionURL = process.env.MONGO_ID;
// TODO change database name to the name you chose
const databaseName = "fractals";

// connect to mongodb
mongoose
    .connect(mongoConnectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: databaseName,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// create a new express server
const app = express();
app.use(validator.checkRoutes);

// set up bodyParser, which allows us to process POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up a session, which will persist login data across requests
app.use(
    session({
        secret: "session-secret",
        resave: false,
        saveUninitialized: false
    })
);

// this checks if the user is logged in, and populates "req.user"
app.use(auth.populateCurrentUser);

// connect user-defined routes
app.use("/api", api);

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
    res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status === 500) {
        // 500 means Internal Server Error
        console.log("The server errored when processing a request!");
        console.log(err);
    }

    res.status(status);
    res.send({
        status: status,
        message: err.message,
    });
});

// hardcode port to 3000 for now
const port = process.env.PORT || 3000;
const server = http.Server(app);

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
