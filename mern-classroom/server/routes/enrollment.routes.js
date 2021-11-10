import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import courseCtrl from '../controllers/course.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

/* -----------------------------------------------------------  API endpoints */
router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, 
            enrollmentCtrl.listEnrolled)                    /*  queries the Enrollments that match user reference */

router.route('/api/enrollment/new/:courseId')
  .post(authCtrl.requireSignin, 
            enrollmentCtrl.findEnrollment, 
            enrollmentCtrl.create)                          /* create a new enrollment in the db, param courseId */

router.route('/api/enrollment/stats/:courseId')
  .get(enrollmentCtrl.enrollmentStats)                      /*  queries the stats object for specified course */

router.route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignin, 
            enrollmentCtrl.isStudent, 
            enrollmentCtrl.complete)                        /*  sets specific lessons as complete, and/or course as complete (all lessons complete) */

router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, 
            enrollmentCtrl.isStudent, 
            enrollmentCtrl.read)                            /* returns the enrollment dtails from db for specified enrollmentId */

  .delete(authCtrl.requireSignin, 
            enrollmentCtrl.isStudent, 
            enrollmentCtrl.remove)                          /* removes the specified enrollment document from the db */

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router