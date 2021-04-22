const SignupPost = require('../models/singing2021-posts');
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
      message: 'Creating a post failed!'
    });
  });
  EmailService.email.signup(signuppost).catch(console.error);
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const postData = Object.assign(req.body, {});
  postData._id = req.params.id;
  const post = new SignupPost(postData);
  SignupPost.updateOne({ _id: req.params.id }, post)
    .then(result => {
      console.log(result)
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({
        message: 'Couldn\'t udpate the post!'
      });
    });
};

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

exports.getPost = (req, res, next) => {
  SignupPost.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed!'
      });
    });
};

exports.deletePost = (req, res, next) => {
  SignupPost.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' });
      } else {
        // res.status(401).json({ message: 'Not authorized!' });
        console.log(result)
        res.status(500).json({ message: 'Now Ya effed up!'})
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting posts failed!'
      });
    });
};


