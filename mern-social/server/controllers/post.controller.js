import Post from '../models/post.model'
import errorHandler from './../helpers/dbErrorHandler'

/* queries the Post collection in the db to get the matching posts */
/* posts that have postedBy user references matching the current user's followings and the current user */
/* returned posts are sorted by the created timestamp */
const listNewsFeed = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try{
      let posts = await Post.find({postedBy: { $in : req.profile.following } })
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .sort('-created')
                            .exec()
      res.json(posts)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* queries the Post collection to find posts for a specific User */
/* posts that have a matching reference in the postBy field to the specified User by userId */
const listByUser = async (req, res) => {
    try{
      let posts = await Post.find({postedBy: req.profile._id})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .sort('-created')
                            .exec()
      res.json(posts)
    }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* uses the formidable module to access the fields and the image file for a post */
import formidable from 'formidable'
import fs from 'fs'
const create = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded"
        })
      }
      let post = new Post(fields)
      post.postedBy= req.profile
      if(files.photo){
        post.photo.data = fs.readFileSync(files.photo.path)
        post.photo.contentType = files.photo.type
      }
      try {
        let result = await post.save()
        res.json(result)
      }catch (err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    })
}

/* removes a specified post from the db */
const remove = async (req, res) => {
  let post = req.post
  try{
    let deletedPost = await post.remove()
    res.json(deletedPost)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/* returns the photo data stored in db as an image file */
const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

/* uses :postId parameter to query the db by _id, which fetches and loads the Post into the Express request obj */
/* the next() function specific to the req that came in will be executed */
/* next() middleware is used to propagate control to the next relevant controller function */
const postByID = async (req, res, next, id) => {
    try{
      let post = await Post.findById(id).populate('postedBy', '_id name').exec()
      if (!post)
        return res.status('400').json({
          error: "Post not found"
        })
      req.post = post
      next()
    }catch(err){
      return res.status('400').json({
        error: "Could not retrieve use post"
      })
    }
}

/* checks whether the signed-in user is the original creator of the post */
/* if so, the next() function specific to the req that came in will be executed */
const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

/* pushes the current user's ID to the likes array */
/* the postId received in the request body will be used to find the specific Post document to update */
const like = async (req, res) => {
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
      res.json(result)
    }catch(err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
    }
}

/* pulls the current user's ID from the likes array */
/* the postId received in the request body will be used to find the Specific Post document to update */
const unlike = async (req, res) => {
    try {
      let result = await Post.findByIdAndUpdate(req.body.postId, 
                                  {$pull: {likes: req.body.userId}}, 
                                  {new: true})
      res.json(result)
    } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* finds the relevant post to be updated via postId and pushes the comment to it's comments array */
/* uses the comment object that is received in the request body */
/* in the response, the update post object is sent back with new comment data included */
const comment = async (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId
    try {
      let result = await Post.findByIdAndUpdate(req.body.postId, 
                                     {$push: {comments: comment}}, 
                                     {new: true})
                              .populate('comments.postedBy', '_id name')
                              .populate('postedBy', '_id name')
                              .exec()
      res.json(result)
    } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* finds the relevant post to be updated via postId and pulls the comment from it's comments array */
/* in the response, the update post object is sent back with comment data removed */
const uncomment = async (req, res) => {
    let comment = req.body.comment
    try{
      let result = await Post.findByIdAndUpdate(req.body.postId, 
                                    {$pull: {comments: {_id: comment._id}}},  
                                    {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
      res.json(result)
    } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

export default {
    listNewsFeed,
    listByUser,
    create,
    remove,
    photo,
    postByID,
    isPoster,
    like,
    unlike,
    comment,
    uncomment
}