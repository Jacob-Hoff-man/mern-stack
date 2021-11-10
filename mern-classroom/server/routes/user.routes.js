import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

/* --------------------------------------------------------------- API endpoints */
router.route('/api/users')
      .get(userCtrl.list)/* fetch all the Users */                                         
      .post(userCtrl.create)                                      

router.route('/api/users/:userId')
      .get(authCtrl.requireSignin, userCtrl.read)/* read a single User */
      .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)/* update a single User */
      .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)/* delete a single User */

router.param('userId', userCtrl.userByID)                         /* fetches requested User for routes containing :userId param */

export default router