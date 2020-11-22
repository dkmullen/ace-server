const nodemailer = require('nodemailer');

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

async function signup(post) {
  if (post.event === 'test') {
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

  } else if (post.event === 'national') {
    let info = await transporter.sendMail({
      from: '"ACE: The Alliance for Creative Excellence" <jay@aceknox.com>',
      to: `dkmullen@gmail.com`,
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
}

exports.email = { signup: signup };