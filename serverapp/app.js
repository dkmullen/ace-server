const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();

mongoose.connect(process.env.ATLAS_CREDS, 
    { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Connection failed', err);
})

app.use(bodyParser.json());

const SignupPost = require('./models/signup-post');
const NationalPost = require('./models/nationalpost');

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

// Generic Signup form 
app.post("/api/signup-posts", (req, res, next) => {
  const signuppost = new SignupPost({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    grade: req.body.grade,
    school: req.body.school,
    city: req.body.city,
    state: req.body.state,
    entryType: req.body.entryType,
    videolink: req.body.videolink,
    imagePath: req.body.imagePath
  })
  signuppost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  signup(signuppost).catch(console.error);
});

// National Contest entry form 
app.post("/api/national-posts", (req, res, next) => {
  const nationalpost = new NationalPost({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    grade: req.body.grade,
    school: req.body.school,
    city: req.body.city,
    state: req.body.state,
    entryType: req.body.entryType,
    videolink: req.body.videolink,
  })
  nationalpost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  national(nationalpost).catch(console.error);
});

// Implement nodemailer...
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PW
  }
});

// async..await is not allowed in global scope, must use a wrapper

async function signup(post) {
  let info = await transporter.sendMail({
    from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
    to: `dkmullen@gmail.com`,
    subject: `Yo: A new test from The National ACE Theatre Awards`,
    text: 'No plain text version',
    html: `<b>The National ACE Theatre Awards</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for The National ACE Theatre Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            ImagePath: ${post.imagePath}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br />
            City: ${post.city}<br />
            State: ${post.state}<br />
            Video Link: ${post.videolink}<br />
            Entry Type: ${post.entryType}<br /><br />
            `
  });
  console.log('Message sent: %s', info.messageId);
}

async function national(post) {
  let info = await transporter.sendMail({
    from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
    to: `jay@aceknox.com, dkmullen@gmail.com`,
    subject: `A new entry for The National ACE Theatre Awards`,
    text: 'No plain text version',
    html: `<b>The National ACE Theatre Awards</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for The National ACE Theatre Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br />
            City: ${post.city}<br />
            State: ${post.state}<br />
            Video Link: ${post.videolink}<br />
            Entry Type: ${post.entryType}<br /><br />
            `
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: `You have registered for The National ACE Theatre Awards`,
    text: 'No plain text version',
    html: `<b>The National ACE Theatre Awards</b> (from aceknox.com)<br />
            <p>You have successfully registered for The National ACE Theatre Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br />
            City: ${post.city}<br />
            State: ${post.state}<br />
            Video Link: ${post.videolink}<br />
            Entry Type: ${post.entryType}<br /><br />
            <br />
            <br />
            Please contact <a href="mailto:jay@aceknox.com">jay@aceknox.com</a> with any questions. Thank you for signing up!`
  });
  console.log('Message sent: %s', resMsg.messageId);
}

module.exports = app;