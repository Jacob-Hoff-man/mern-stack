import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

/* receives the email and password in req.body */
/* retrieves a matching user with email from the db and password is authenticated */
/* JWT module is used to generate a signed JWT for successful account authentications */
/* the signed JWT and User details are returned to the POST requesting, authenticated client */
/* additionally, the return is saved as a cookie in the res obj and is available client-side */
const signin = async (req, res) => {
    
    try {
      let user = await User.findOne({ "email": req.body.email })
      if (!user)
        return res.status('401').json({ error: "User not found" })
  
      if (!user.authenticate(req.body.password)) {
        return res.status('401').send({ error: "Email and password don't match." })
      }
  
      const token = jwt.sign({ _id: user._id }, config.jwtSecret)
  
      res.cookie('t', token, { expire: new Date() + 9999 })
  
      /* sending user details to be received once the user has successfully signed in */
      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          educator: user.educator
        }
      })
    } catch (err) {
      return res.status('401').json({ error: "Could not sign in" })
    }
}

/* clears the response cookie containing the signed JWT */
const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
      message: "signed out"
    })
}

/* handles protecting a route against unauthenticated access */
/* uses express-jwt to verify that the incoming req has a valid JWT */
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
})

/* checks whether the authenticated user is the same as the req User */
/* req.auth obj is populated by express-jwt in requireSignin after auth verified */
/* req.profile obj is populated by userByID */
/* the next() function specific to the req that came in will be executed */
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth 
          && req.profile._id ==  req.auth._id
    if (!(authorized)) {
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
  }

export default { signin, signout, requireSignin, hasAuthorization }