const SignupPost = require('../models/signup-post');
const NationalPost = require('../models/nationalpost');
const EmailService = require('../services/email-service');

exports.createPost = (req, res, next) => {
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
        ...createdPost
      }    
    })
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
  console.log(EmailService.email)
  EmailService.email.signup(signuppost).catch(console.error);
  // EmailService.email.runme(signuppost)
}

exports.getPosts = (req, res, next) => {
  SignupPost.find()
    .then(documents => {
      // console.log(documents)
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents,
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed.'
      });
    });
}

exports.deletePosts = (req, res, next) => {
  console.log('hey now!')
  SignupPost.find()
  .then(documents => {
    documents.forEach(document => {
      Post.deleteOne({ _id: document.id })
    })
  })
  .catch(error => {
    res.status(500).json({
      message: 'Something failed in deletePosts.'
    });
  });
}

exports.createNationalPost = (req, res, next) => {
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
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed.'
    });
  });

  EmailService.national(nationalpost).catch(console.error);
}

