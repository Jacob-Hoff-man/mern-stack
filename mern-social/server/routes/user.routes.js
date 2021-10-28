import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

/* --------------------------------------------------------------- API endpoints */
router.route('/api/users')
      .get(userCtrl.list)                                         /* create a new User */
      .post(userCtrl.create)                                      /* fetch all the Users */

router.route('/api/users/photo/:userId')
      .get(userCtrl.photo, 
            userCtrl.defaultPhoto)                                /* get user photo */
 
router.route('/api/users/follow')
      .put(authCtrl.requireSignin, 
            userCtrl.addFollowing,               
            userCtrl.addFollower)                                 /* add follower to User */

router.route('/api/users/unfollow')
      .put(authCtrl.requireSignin, 
            userCtrl.removeFollowing,           
            userCtrl.removeFollower)                              /* remove follower from User */

router.route('/api/users/findpeople/:userId')
      .get(authCtrl.requireSignin, userCtrl.findPeople)           /* fetch all the users not followed by User */

router.route('/api/users/defaultphoto')
      .get(userCtrl.defaultPhoto)                                 /* get default photo */

router.route('/api/users/:userId')
      .get(authCtrl.requireSignin, 
            userCtrl.read)                                        /* read a single User */
      .put(authCtrl.requireSignin, 
            authCtrl.hasAuthorization, 
            userCtrl.update)                                      /* update a single User */
      .delete(authCtrl.requireSignin, 
            authCtrl.hasAuthorization, 
            userCtrl.remove)                                      /* delete a single User */

router.param('userId', userCtrl.userByID)                         /* fetches requested User for routes containing :userId param */

export default router