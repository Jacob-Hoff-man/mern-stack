import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import courseCtrl from '../controllers/course.controller'

const router = express.Router()

/* --------------------------------------------------  API endpoints */
router.route('/api/courses/published')
    .get(courseCtrl.listPublished)                  /* retrieve a list of all published courses from the db */

router.route('/api/courses/by/:userId')
    .post(authCtrl.requireSignin, 
            authCtrl.hasAuthorization, 
            userCtrl.isEducator, 
            courseCtrl.create)                      /* verifies current user is an educator, then creates new course with provided data */ 
                                  
router.route('/api/courses/photo/:courseId')
    .get(courseCtrl.photo, 
            courseCtrl.defaultPhoto)                /* gets the image data from db and sends it as a file in response */ 

router.route('/api/courses/defaultphoto')
    .get(courseCtrl.defaultPhoto)                   /* get default photo */

router.route('/api/courses/by/:userId')
    .get(authCtrl.requireSignin,
            authCtrl.hasAuthorization,
            courseCtrl.listByInstructor)            /* retrieve all the courses created by a given user */

router.route('/api/courses/:courseId')
    .get(courseCtrl.read)                           /* retrieve the course in db */

router.route('/api/courses/:courseId/lesson/new')
    .put(authCtrl.requireSignin,
            courseCtrl.isInstructor,
            courseCtrl.newLesson)                   /* sends a new course to the db */

router.route('/api/courses/:courseId')
    .put(authCtrl.requireSignin,
            courseCtrl.isInstructor,
            courseCtrl.update)                      /* updates an existing course */

router.route('/api/courses/:courseId')
    .delete(authCtrl.requireSignin,
                courseCtrl.isInstructor,
                courseCtrl.remove)                  /* deletes a specified course from the db */
    
router.param('userId', userCtrl.userByID)           /* required for getting the courses list */
router.param('courseId', courseCtrl.courseByID)     /* required for getting course page */

export default router