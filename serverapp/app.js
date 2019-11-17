const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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
  main(post).catch(console.error);
});

// async..await is not allowed in global scope, must use a wrapper
async function main(post) { console.log('here', JSON.stringify(post))

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PW
  }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Dennis Mullen - ACE Awards Form" <dkmullen@gmail.com>', // sender address
    to: 'dkmullen@gmail.com', // list of receivers
    subject: 'A new contestant for the ACE Singing Awards!', // Subject line
    text: 'Whatevs', // plain text body
    html: `<b>ACE Singing Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Singing Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br />
            Rising Star?: ${post.rising}<br />
            Individual Vocal?: ${post.individualVocal}<br />
            Individual Instrumental?: ${post.individualInstrumental}<br />
            Group?: ${post.group}<br />`
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = app;