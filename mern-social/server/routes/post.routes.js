import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

/* ---------------------------------------------------------------- API endpoints */
router.route('/api/posts/feed/:userId')                                  
    .get(authCtrl.requireSignin, 
        postCtrl.listNewsFeed)                                      /* request to retrieve Newsfeed posts for a specific User */

router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, 
        postCtrl.listByUser)                                        /* receives a query to return posts by a specific user */

router.route('/api/posts/new/:userId')
    .post(authCtrl.requireSignin, postCtrl.create)                  /* creates a new post in the db */

router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)                                            /* request to retrieve the specific Post's photo */

router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignin,
        postCtrl.isPoster,
        postCtrl.remove)                                            /* request to delete a post from the db */

router.route('/api/posts/like')
    .put(authCtrl.requireSignin, 
        postCtrl.like)                                              /* request to update the likes array in Post */

router.route('/api/posts/comment')
    .put(authCtrl.requireSignin, postCtrl.comment)                  /* updates the Post by adding a comment */

router.route('/api/posts/uncomment')
    .put(authCtrl.requireSignin, postCtrl.uncomment)                /* updates the Post by removing a comment */

router.param('userId', userCtrl.userByID)                           /* fetches requested User for routes containing :userId param */
router.param('postId', postCtrl.postByID)                           /* fetches requested Post for routes containing :postId param */

export default router