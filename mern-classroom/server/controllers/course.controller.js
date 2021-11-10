import Course from '../models/course.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import defaultImage from './../../client/assets/images/default.png'
/* formidable is used to parse the multipart data form */
import formidable from 'formidable'
import fs from 'fs'

/* formidable is used to parse the multipart request for potential image */
/* temp stores file in filesystem, read with fs module for retrieval */
const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded"
        })
      }
      let course = new Course(fields)
      course.instructor= req.profile
      if(files.image){
        course.image.data = fs.readFileSync(files.image.path)
        course.image.contentType = files.image.type
      }
      try {
        let result = await course.save()
        res.json(result)
      }catch (err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    })
}

/* returns the specified course object from the db */
const read = (req, res) => {
    req.course.image = undefined
    return res.json(req.course)
}
  

/* queries the Course collection in the db to get the matching courses */
/* returns all courses that have an instructor field that matches the user specified with userId param */
const listByInstructor = (req, res) => {
    Course.find({instructor: req.profile._id}, (err, courses) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(courses)
    }).populate('instructor', '_id name')
}

/* retrieves the course from the db, attaches it to the req obj to be used */
/* req obj is used in the next method after */
const courseByID = async (req, res, next, id) => {
    try {
      let course = await Course.findById(id).populate('instructor', '_id name')
      if (!course)
        return res.status('400').json({
          error: "Course not found"
        })
      req.course = course
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve course"
      })
    }
}

/* checks whether the current user is the instructor for the course using isInstructor, then saves new lesson in db */
/* invoking next middleware executes the newLesson method */
const isInstructor = (req, res, next) => {
    const isInstructor = req.course && req.auth && (req.course.instructor._id == req.auth._id)
    if(!isInstructor){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

/* finds the corresponding course doc using findByIdAndUpdate (from MongoDB), then update it's lessons array */
/* the new lesson object is received in the request body */
const newLesson = async (req, res) => {
    try {
      let lesson = req.body.lesson
      let result = await Course.findByIdAndUpdate(req.course._id, 
                                                {$push: {lessons: lesson}, 
                                                  updated: Date.now()}, 
                                                  {new: true})
                              .populate('instructor', '_id name')
                              .exec()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* updates a course in the db */
const update = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Photo could not be uploaded"
        })
      }
      let course = req.course
      course = extend(course, fields)
      /* parse and assign the lessons array to the course */
      if(fields.lessons){
        course.lessons = JSON.parse(fields.lessons)
      }

      course.updated = Date.now()
      if(files.image){
        course.image.data = fs.readFileSync(files.image.path)
        course.image.contentType = files.image.type
      }
      try {
        await course.save()
        res.json(course)
      } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    })
}

/* deletes the course document that corresponds to the provided ID from the db */
const remove = async (req, res) => {
    try {
      let course = req.course
      let deleteCourse = await course.remove()
      res.json(deleteCourse)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* gets a list of all published courses */
const listPublished = (req, res) => {
  Course.find({}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('instructor', '_id name')
}

/* returns the course photo from the db as an image file */
const photo = (req, res, next) => {
    if(req.course.image.data){
      res.set("Content-Type", req.course.image.contentType)
      return res.send(req.course.image.data)
    }
    next()
}
  
/* returns the default course photo */
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+defaultImage)
}

export default {
    create,
    read,
    listByInstructor,
    courseByID,
    isInstructor,
    newLesson,
    update,
    remove,
    listPublished,
    photo,
    defaultPhoto
}