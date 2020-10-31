const express = require("express");
const path = require("path");
const multer = require('multer');
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
app.use("/images", express.static(path.join('images')));

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

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]; // returns null if filetype isn't in our map
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    // this path below is relative to server.js file
    cb(error, 'images'); // first arg is err state, set to null if none
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-'); // spaces to dashes
    const ext = MIME_TYPE_MAP[file.mimetype]; // get the right extention
    cb(null, name + '-' + Date.now() + '.' + ext); // make a unique filename
  }
});

// Generic Signup form 
app.post("/api/signup-posts", multer({ storage: storage }).single('image'),(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
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
  });

  if (req.file && req.file.filename) {
    signuppost.imagePath = url + '/images/' + req.file.filename;
  };

  signuppost.save()
  .then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      signupPost: {
        postId: createdPost._id,
        name: createdPost.name,
        email: createdPost.email,
        phone: createdPost.phone,
        age: createdPost.age,
        grade: createdPost.grade,
        school: createdPost.school,
        city: createdPost.city,
        state: createdPost.state,
        entryType: createdPost.entryType,
        videolink: createdPost.videolink,
        imagePath: createdPost.imagePath
      }    
    })
  });
  signup(signuppost).catch(console.error);
});

app.get('/api/signup-posts', (req, res, next) => {
  SignupPost.find()
  .then(documents => {
    console.log(documents)
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents,
    })
  })

    // })
    .catch(error => { // catch block is for technical errors
      res.status(500).json({
        message: 'Fetching posts failed.'
      });
    });
})

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
            Image: ${post.imagePath}<br />
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