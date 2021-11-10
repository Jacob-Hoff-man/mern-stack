import Enrollment from '../models/enrollment.model'
import errorHandler from './../helpers/dbErrorHandler'

/* queries the Enrollments in the db to check if enrollment exists already for given courseId, userId */
const findEnrollment = async (req, res, next) => {
    try {
      let enrollments = await Enrollment.find({course:req.course._id, 
                                               student: req.auth._id})
      if(enrollments.length == 0){
        next()
      }else{
        res.json(enrollments[0])
      }
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* generates a new enrollment object to be saved in the db */
const create = async (req, res) => {
    let newEnrollment = {
      course: req.course,
      student: req.auth,
    }
    /* iterating over lessons array in course to generate lessonStatus array of objs */
    newEnrollment.lessonStatus = req.course.lessons.map((lesson)=>{
      return {lesson: lesson, complete:false}
    })
    const enrollment = new Enrollment(newEnrollment)
    try {
      let result = await enrollment.save()
      return res.status(200).json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* queries the Enrollments for the specified enrollmentId */
/* populate the referenced course, nested course instructor, and referenced student details for confirmed enrollment doc */
/* resulting enrollment object is attached to the next() controller method, passed to the isStudent method */
const enrollmentByID = async (req, res, next, id) => {
    try {
      let enrollment = await Enrollment.findById(id)
                                      .populate({path: 'course', populate:{ path: 'instructor'}})
                                      .populate('student', '_id name')
      if (!enrollment)
        return res.status('400').json({
          error: "Enrollment not found"
        })
      req.enrollment = enrollment
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve enrollment"
      })
    }
}

/* confirm the auth credentials by the enrollment's student id for the current user */
/* next method will pass to the read method */
const isStudent = (req, res, next) => {
    const isStudent = req.auth && req.auth._id == req.enrollment.student._id
    if (!isStudent) {
      return res.status('403').json({
        error: "User is not enrolled"
      })
    }
    next()
}

/* return the enrollment obj in request as result */
const read = (req, res) => {
    return res.json(req.enrollment)
}

/* remove the enrollment obj from the db */
const remove = async (req, res) => {
    try {
      let enrollment = req.enrollment
      let deletedEnrollment = await enrollment.remove()
      res.json(deletedEnrollment)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* returns a successfully updated enrollment document after complete update */ 
/* using updateOne action from MongoDB to update the enrollment document */
/* if the courseCompleted value is sent in the req, update the completed field in updated enrollment document */
const complete = async (req, res) => {
    let updatedData = {}
    updatedData['lessonStatus.$.complete']= req.body.complete 
    updatedData.updated = Date.now()
    if(req.body.courseCompleted) {
        updatedData.completed = req.body.courseCompleted
    }
  
    try {
        let enrollment = await Enrollment.updateOne({'lessonStatus._id':req.body.lessonStatusId}, {'$set': updatedData})
        res.json(enrollment)
    } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
    }
}

/* queries the db and returns the results in the response */
/* finds all the enrollments with the user reference that matches the current user's userId */
/* resulting enrollment is handled slightly, some sorting for completed lessons */
const listEnrolled = async (req, res) => {
    try {
      let enrollments = await Enrollment.find({student: req.auth._id}).sort({'completed': 1}).populate('course', '_id name category')
      res.json(enrollments)
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/* returns a stats object containing the total enrollments/completions for the specified course */
/* two queries (enrollments count/completed enrollments count) for the Enrollments using the specified courseId from req */
const enrollmentStats = async (req, res) => {
    try {
      let stats = {}
      stats.totalEnrolled = await Enrollment.find({course:req.course._id}).countDocuments()
      stats.totalCompleted = await Enrollment.find({course:req.course._id}).exists('completed', true).countDocuments()
        res.json(stats)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
} 
  
export default {
    findEnrollment,
    create,
    enrollmentByID,
    isStudent,
    read,
    remove,
    complete,
    listEnrolled,
    enrollmentStats
}

  

