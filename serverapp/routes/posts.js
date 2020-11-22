const express = require('express');

const PostController = require('../controllers/posts');
const extractFile = require('../middleware/file');

const router = express.Router();

router.get('', PostController.getPosts);

// extractFile is for attaching a photo to the submission
router.post('', extractFile, PostController.createPost);

router.put('/:id', extractFile, PostController.updatePost);

router.get('/:id', PostController.getPost);

router.delete('/:id', PostController.deletePost);
// router.deleteAll(PostController.deletePosts);

module.exports = router;