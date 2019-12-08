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

// Handle Cross-origin and methods
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

// Singing entry form
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

// Acting entry form (individual)
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
  actingpost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  acting(actingpost).catch(console.error);
});

// Acting team entry form
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
  actingteampost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  console.log(actingteampost)
  actingteam(actingteampost).catch(console.error);
});

// Implement nodemailer...
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

// async..await is not allowed in global scope, must use a wrapper
async function main(post) {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: 'jay@aceknox.com, dkmullen@gmail.com',
    subject: 'A new contestant for the ACE Singing Awards!',
    text: 'No plain text version', // plain text body
    html: `<b>ACE Singing Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Singing Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Rising Star: ${post.rising ? 'X' : ''}<br />
            Individual Vocal: ${post.individualVocal ? 'X' : ''}<br />
            Individual Instrumental: ${post.individualInstrumental ? 'X' : ''}<br />
            Group: ${post.group ? 'X' : ''}<br />`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: 'You have registered for the ACE Singing Awards!',
    text: 'No plain text version',
    html: `<b>ACE Singing Awards Sign-up</b> (from aceknox.com)<br />
            <p>You have successfully signed up for the ACE Singing Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Rising Star: ${post.rising ? 'X' : ''}<br />
            Individual Vocal: ${post.individualVocal ? 'X' : ''}<br />
            Individual Instrumental: ${post.individualInstrumental ? 'X' : ''}<br />
            Group: ${post.group ? 'X' : ''}<br />`
  });
  console.log('Message sent: %s', resMsg.messageId);
}

async function acting(post) {
  let info = await transporter.sendMail({
    from: '"ACE Acting Awards Form" <jay@aceknox.com>',
    to: 'jay@aceknox.com, dkmullen@gmail.com',
    subject: 'A new contestant for the ACE Acting Awards!',
    text: 'No plain text version',
    html: `<b>ACE Acting Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Acting Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Dramatic Monologue: ${post.dramaticMonologue ? 'X' : ''}<br />
            Comedic Monologue: ${post.comedicMonologue ? 'X' : ''}<br />
            Shakespeare Monologue: ${post.shakespeareMonologue ? 'X' : ''}<br />
            Musical Theatre: ${post.musical ? 'X' : ''}<br />`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Acting Awards Form" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: 'You have registered for the ACE Acting Awards!',
    text: 'No plain text version',
    html: `<b>ACE Acting Awards Sign-up</b> (from aceknox.com)<br />
            <p>You have successfully registered for the ACE Acting Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Dramatic Monologue: ${post.dramaticMonologue ? 'X' : ''}<br />
            Comedic Monologue: ${post.comedicMonologue ? 'X' : ''}<br />
            Shakespeare Monologue: ${post.shakespeareMonologue ? 'X' : ''}<br />
            Musical Theatre: ${post.musical ? 'X' : ''}<br />`
  });
  console.log('Message sent: %s', resMsg.messageId);
}

async function actingteam(post) {
  let info = await transporter.sendMail({
    from: '"ACE Acting (Team) Awards Form" <jay@aceknox.com>',
    to: 'jay@aceknox.com, dkmullen@gmail.com',
    subject: 'A new contestant for the ACE Acting (Team) Awards!',
    text: 'No plain text version',
    html: `<b>ACE Acting (Team) Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Acting (Team) Awards:</p>
            School: ${post.school}<br />
            Name: ${post.contactName}<br />
            Email: ${post.contactEmail}<br />
            Phone: ${post.contactPhone}<br /><br />
            Dramatic Monologue: ${post.dramaticName}, Grade: ${post.dramaticGrade}<br />
            Comedic Monologue: ${post.comedicName}, Grade: ${post.comedicGrade}<br />
            Shakespeare Monologue: ${post.shakespeareName}, Grade: ${post.shakespeareGrade}<br />
            Musical Theatre: ${post.musicalName}, Grade: ${post.musicalGrade}<br />`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Acting (Team) Awards Form" <jay@aceknox.com>',
    to: `${post.contactEmail}`,
    subject: 'You have registered for the ACE Acting (Team) Awards!',
    text: 'No plain text version',
    html: `<b>ACE Acting (Team) Awards Sign-up</b> (from aceknox.com)<br />
            <p>You have successfully registered for the ACE Acting (Team) Awards:</p>
            School: ${post.school}<br />
            Name: ${post.contactName}<br />
            Email: ${post.contactEmail}<br />
            Phone: ${post.contactPhone}<br /><br />
            Dramatic Monologue: ${post.dramaticName}, Grade: ${post.dramaticGrade}<br />
            Comedic Monologue: ${post.comedicName}, Grade: ${post.comedicGrade}<br />
            Shakespeare Monologue: ${post.shakespeareName}, Grade: ${post.shakespeareGrade}<br />
            Musical Theatre: ${post.musicalName}, Grade: ${post.musicalGrade}<br />`
  });
  console.log('Message sent: %s', resMsg.messageId);
}
module.exports = app;