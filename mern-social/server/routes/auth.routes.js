import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

/* ------------------------------------------- API endpoints */
router.route('/auth/signin')
  .post(authCtrl.signin)                    /* authenticate User (sign in) */
router.route('/auth/signout')
  .get(authCtrl.signout)                    /* clear User JWT cookie (sign out) */

export default router