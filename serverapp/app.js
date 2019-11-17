const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MLAB_CREDS, 
    { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Connection failed', err);
})

app.use(bodyParser.json());

const Post = require('./models/singingposts');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      grade: req.body.grade,
      school: req.body.school,
      rising: req.body.rising,
      individualVocal: req.body.individualVocal,
      individualInstrumental: req.body.individualInstrumental,
      group: req.body.group
  })
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

module.exports = app;