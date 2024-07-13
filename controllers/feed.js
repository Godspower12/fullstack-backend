const { validationResult } = require('express-validator');
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
Post.find()
.sort({ createdAt: -1 })
.then(posts => {
  console.log(posts)
  res.status(200).json({
    message: 'Fetched posts successfully', posts: posts
    
  })
})
.catch(err => {
  if(!err.statusCode) {
    err.statusCode = 500;
     }
     next(err);
}
)
  
};

exports.getPost = (req, res, next) => {
   const postId = req.params.postId;
   Post.findById(postId)
   .then(post => {
    if(!post){
      const error =  new Error('Could not find post.')
      error.statusCode = 404;
      throw error
    }
    res.status(200).json({message: 'Post fetched', post: post})
   })
   .catch(err => {
     if(!err.statusCode) {
       err.statusCode = 500;
        }
        console.error(`Error fetching post with ID ${postId}:`, err);
        next(err);
   }
   )
}




exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file ? req.file.path : null;

  if (!imageUrl) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl.replace(/\\/g, "/"), // Replace backslashes with forward slashes for consistency
    creator: { name: 'Geepee' }
  });

  post.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.image;
  if(req.file) {
    imageUrl = req.file.path
  }
  if(!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }
}
