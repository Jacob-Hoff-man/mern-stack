/* controller utilizes errorHandler helper to respond meaningfully to Mongoose errors */
/* controller utilizes lodash module's util functions when updating an existing user with changed values */
import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

/* definitions of controller methods used as callbacks for the user route declarations */
/* creates a new user with the user JSON obj received in the FE POST request within req.body */
const create = async (req, res) => {
    const user = new User(req.body)
    try {
      await user.save()
      return res.status(200).json({
        message: "Successfully signed up!"
      })
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* fetch all the users from the db to a list, return it as JSON objs in array to GET requesting client */
const list = async (req, res) => {
    try {
      let users = await User.find().select('name email updated created')
      res.json(users)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* uses :userId parameter to query the db by _id, which fetches and loads the user into the Express request obj */
/* the next() function specific to the req that came in will be executed */
/* next() middleware is used to propagate control to the next relevant controller function */
const userByID = async (req, res, next, id) => {
    try {
      let user = await User.findById(id)
      if (!user)
        return res.status('400').json({
          error: "User not found"
        })
      req.profile = user
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve user"
      })
    }
}

/* retrieves the user details from req.profile and removes sensitive info */
/* returns User obj as JSON obj to the GET requesting client */
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

/* retrieves the user details from the req.profile */
/* lodash module is used to extend and merge the changes that came in the request body to update the user data */
/* sensitive info is removed, and then returns User obj as JSON obj to the PUT requesting client */
const update = async (req, res) => {
    try {
      let user = req.profile
      user = extend(user, req.body)
      user.updated = Date.now()
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* retrieves the user detailes from the req.profile */
/* the remove() query to delete the user from the db */
/* returns the deleted User obj as JSON obj to the DELETE requesting client */ 
const remove = async (req, res) => {
    try {
      let user = req.profile
      let deletedUser = await user.remove()
      deletedUser.hashed_password = undefined
      deletedUser.salt = undefined
      res.json(deletedUser)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

export default { create, userByID, read, list, remove, update }