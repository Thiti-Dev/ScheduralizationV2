const express = require('express');
const router = express.Router();
// Importing function from the controller
const {
	getAvailableCourseBetweenTimeSlot,
	getSpecificCourseWithConsequence,
	getAllAvailableCourses,
	scoreTheCourse,
	getScoreAndDesc,
	assignSchedule,
	deAssignSchedule,
	getUserScheduledCourses
} = require('../../controller/courses');

const { protect } = require('../../middleware/auth');

router.route('/').get(getAllAvailableCourses);
router.route('/getavailablebetweentime').get(protect, getAvailableCourseBetweenTimeSlot);
router.route('/getSpecificCourseWithConsequence/:courseID').get(protect, getSpecificCourseWithConsequence);

router.route('/score/:courseID').post(protect, scoreTheCourse);
router.route('/score/:courseID').get(getScoreAndDesc);

router.route('/:courseID/assign').post(protect, assignSchedule).delete(protect, deAssignSchedule);
router.route('/myschedule').get(protect, getUserScheduledCourses);
module.exports = router;
