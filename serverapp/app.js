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
const ActingPost = require('./models/actingposts');
const ActingTeamPost = require('./models/actingteamposts');

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

app.post("/api/acting-posts", (req, res, next) => {
  const actingpost = new ActingPost({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    grade: req.body.grade,
    school: req.body.school,
    dramaticMonologue: req.body.dramaticMonologue,
    comedicMonologue: req.body.comedicMonologue,
    shakespeareMonologue: req.body.shakespeareMonologue,
    musical: req.body.musical
  })
  // post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  acting(actingpost).catch(console.error);
});

app.post("/api/acting-team-posts", (req, res, next) => {
  console.log(req.body.contactName)
  const actingteampost = new ActingTeamPost({
    school: req.body.school,
    contactName: req.body.contactName,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone,
    dramaticName: req.body.dramaticName,
    dramaticGrade: req.body.dramaticGrade,
    comedicName: req.body.comedicName,
    comedicGrade: req.body.comedicGrade,
    shakespeareName: req.body.shakespeareName,
    shakespeareGrade: req.body.shakespeareGrade,
    musicalName: req.body.musicalName,
    musicalGrade: req.body.musicalGrade,
  })
  // post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  console.log(actingteampost)
  actingteam(actingteampost).catch(console.error);
});
// async..await is not allowed in global scope, must use a wrapper
async function main(post) {

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

async function acting(post) {

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
    subject: 'A new contestant for the ACE Acting Awards!', // Subject line
    text: 'Whatevs', // plain text body
    html: `<b>ACE Acting Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Acting Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br />
            Dramatic Monologue?: ${post.dramaticMonologue}<br />
            Comedic Monologue?: ${post.comedicMonologue}<br />
            Shakespeare Monologue?: ${post.shakespeareMonologue}<br />
            Musical Theatre?: ${post.musical}<br />`
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

async function actingteam(post) {

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
    subject: 'A new contestant for the ACE Acting (Team) Awards!', // Subject line
    text: 'Whatevs', // plain text body
    html: `<b>ACE Acting (Team) Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Acting (Team) Awards:</p>
            School: ${post.school}<br />
            Name: ${post.contactName}<br />
            Email: ${post.contactEmail}<br />
            Phone: ${post.contactPhone}<br /><br />

            Dramatic Monologue?: ${post.dramaticName}, Grade: ${post.dramaticGrade}<br />
            Comedic Monologue?: ${post.comedicName} Grade: ${post.comedicGrade}<br />
            Shakespeare Monologue?: ${post.shakespeareName} Grade: ${post.shakespeareGrade}<br />
            Musical Theatre?: ${post.musical} Grade: ${post.musicalGrade}<br />`
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
module.exports = app;