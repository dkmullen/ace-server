const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const postsRoutes = require("./routes/posts");

// add this code
const whitelist = ['https://www.aceknox.com']; // list of allow domain

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}

// end 
app.use(cors(corsOptions));

mongoose.connect(process.env.ATLAS_CREDS, 
    { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Connection failed', err);
})

app.use(bodyParser.json());
app.use("/images", express.static(path.join('images')));

// Handle Cross-origin and methods
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/signup-posts", postsRoutes);

module.exports = app;