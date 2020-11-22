const SignupPost = require('../models/signup-post');
const EmailService = require('../services/email-service');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const postData = Object.assign(req.body, {});
  const signuppost = new SignupPost(postData);

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
  EmailService.email.signup(signuppost).catch(console.error);
}

exports.getPosts = (req, res, next) => {
  SignupPost.find()
    .then(documents => {
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

exports.deletePost = (req, res, next) => {
  SignupPost.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};


