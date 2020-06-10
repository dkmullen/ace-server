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
const TheatreCampPost = require('./models/theatre-class-posts');
const InstrumentalPost = require('./models/instrumentalpost');
const DancePost = require('./models/saferathomeposts');
const SummerClassPost = require('./models/summerclass-posts');

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

// Summer Monologue Classes entry form 
app.post("/api/summerclass-posts", (req, res, next) => {
  const summerclasspost = new SummerClassPost({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    teacher: req.body.teacher,
    classname: req.body.classname
  })
  summerclasspost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  summerclass(summerclasspost).catch(console.error);
});

// Instrumental entry form (individual)
app.post("/api/shakespeare-posts", (req, res, next) => {
  const instrumentalpost = new InstrumentalPost({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    grade: req.body.grade,
    school: req.body.school,
    link: req.body.link,
  })
  instrumentalpost.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
  instrumental(instrumentalpost).catch(console.error);
});

// Theatre camp entry form
app.post("/api/theatre-class-posts", (req, res, next) => {
  const tcpost = new TheatreCampPost({
    parent: req.body.parent,
    email: req.body.email,
    phone: req.body.phone,
    student1: {
      name: req.body.student1.name,
      age: req.body.student1.age
    },
    student2: {
      name: req.body.student2.name,
      age: req.body.student2.age
    },
    student3: {
      name: req.body.student3.name,
      age: req.body.student3.age
    },
    student4: {
      name: req.body.student4.name,
      age: req.body.student4.age
    }

  })

  let emailObj = { parent: tcpost.parent, email: tcpost.email, phone: tcpost.phone };
  let studentStr = `${tcpost.student1.name} - ${tcpost.student1.age}<br />`

  if (tcpost.student2.name !== null && tcpost.student2.name !== '' ) {
    studentStr += `${tcpost.student2.name} - ${tcpost.student2.age}<br />`
  };
  if (tcpost.student3.name !== null && tcpost.student3.name !== '' ) { 
    studentStr += `${tcpost.student3.name} - ${tcpost.student3.age}<br />`
  };
  if (tcpost.student4.name !== null && tcpost.student4.name !== '' ) { 
    studentStr += `${tcpost.student4.name} - ${tcpost.student4.age}<br />`
  };
  emailObj.studentStr = {studentStr: studentStr}

  tcpost.save();
  console.log(res)
  res.status(201).json({
    message: 'Post added successfully'
  });
  theatreClass(emailObj).catch(console.error);
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
    group: req.body.group,
    musicalTheatre: true
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
  actingteam(actingteampost).catch(console.error);
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
async function summerclass(post) {
  let info = await transporter.sendMail({
    from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
    to: 'dkmullen@gmail.com',
    subject: `A new member for the online ${post.classname}`,
    text: 'No plain text version',
    html: `<b>ACE online ${post.classname}</b> (from aceknox.com)<br />
            <p>A new student has signed up for the ACE online ${post.classname}:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            `
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: `You have registered for the ACE online ${post.classname}`,
    text: 'No plain text version',
    html: `<b>ACE ACE online ${post.classname}</b> (from aceknox.com)<br />
            <p>You have successfully registered for the ACE online ${post.classname}:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            <br />
            If you haven't paid the $75 fee, you may do so 
            <a href="https://aceknox.com/coaching/pay">here</a>. You should receive a confirmation from PayPal
            when the transaction is complete. `
  });
  console.log('Message sent: %s', resMsg.messageId);
}

// async..await is not allowed in global scope, must use a wrapper
async function instrumental(post) {
  let info = await transporter.sendMail({
    from: '"ACE Safer@Home Shakespeare Form" <jay@aceknox.com>',
    to: 'jay@aceknox.com, dkmullen@gmail.com',
    subject: 'A new contestant for the ACE Safer@Home Shakespeare Contest!',
    text: 'No plain text version',
    html: `<b>ACE Shakespeare Contest Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Shakespeare Contest:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Video Link: ${post.link}<br />`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Safer@Home Shakespeare Contest" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: 'You have registered for the ACE Safer@Home Shakespeare Contest!',
    text: 'No plain text version',
    html: `<b>ACE Safer@Home Shakespeare Contest</b> (from aceknox.com)<br />
            <p>You have successfully registered for the ACE Safer@Home Shakespeare Contest:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Video Link: ${post.link}<br />`
  });
  console.log('Message sent: %s', resMsg.messageId);
}

async function theatreClass(post) { 
  console.log(post)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: 'dkmullen@gmail.com',
    subject: 'A new registration for the ACE Theatre Camp for Young People!',
    text: 'No plain text version', // plain text body
    html: `<b>ACE Theatre Camp Sign-up</b> (from aceknox.com)<br />
            <p>A new registration has arrived for the ACE Theatre Camp:</p>
            Parent: ${post.parent}<br />
            Phone: ${post.phone}<br />
            Email: ${post.email}<br />
            <br />
            ${post.studentStr.studentStr}<br />
  
`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: 'You have registered for the ACE Theatre Camp for Young People',
    text: 'No plain text version',
    html: `<b>ACE Theatre Camp Sign-up</b> (from aceknox.com)<br />
            <p>You have successfully submitted the registration for the ACE Theatre Camp for Young People:</p>
            Parent/Guardian: ${post.parent}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br /><br />
            ${post.studentStr.studentStr}<br />

     

            March 28—May 2 (Six Saturdays)<br />
            Ages 6-9: 8am-11am<br />
            Ages 10-14: 1pm-4pm<br />
            <b>Cost: $195 per child</b> <br />
           
            <div>Reserve your spot paying online at aceknox.com/pay or by sending a check or e-check ($195 per child) to:
            <div class="spacer"></div>
        
            <p> ACE: Alliance for Creative Excellence<br />
            234 Morrell Rd #189<br/>Knoxville, TN 37919</p> </div>
           
            <br />

            The camp will take place at 4434 Middlebrook Pike.
For more information contact Jay Apking (jay@aceknox.com) 
            `
  });
  console.log('Message sent: %s', resMsg.messageId);
}


async function main(post) {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: 'jay@aceknox.com, dkmullen@gmail.com',
    subject: 'A new contestant for the ACE Singing Awards, Musical Theatre cetegory!',
    text: 'No plain text version', // plain text body
    html: `<b>ACE Singing Awards Sign-up</b> (from aceknox.com)<br />
            <p>A new contestant has signed up for the ACE Singing Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Category: Musical Theatre
            Rising Star: ${post.rising ? 'X' : ''}<br />
            Individual Vocal: ${post.individualVocal ? 'X' : ''}<br />
            Individual Instrumental: ${post.individualInstrumental ? 'X' : ''}<br />
            Group: ${post.group ? 'X' : ''}<br />`
  });
  console.log('Message sent: %s', info.messageId);

  let resMsg = await transporter.sendMail({
    from: '"ACE Singing Awards Form" <jay@aceknox.com>',
    to: `${post.email}`,
    subject: 'You have registered for the ACE Singing Awards (Musical Theatre category)!',
    text: 'No plain text version',
    html: `<b>ACE Singing Awards Sign-up</b> (from aceknox.com)<br />
            <p>You have successfully signed up for the ACE Singing Awards:</p>
            Name: ${post.name}<br />
            Age: ${post.age}<br />
            Email: ${post.email}<br />
            Phone: ${post.phone}<br />
            Grade: ${post.grade}<br />
            School: ${post.school}<br /><br />
            Be sure to submit your audition video, or a link to it, to jay@aceknox.com<br />
            by 11:59pm on Friday, January 3, 2020. Good luck!
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
    to: 'dkmullen@gmail.com',
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
    to: 'dkmullen@gmail.com',
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