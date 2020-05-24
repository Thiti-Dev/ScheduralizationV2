const express = require('express');
const router = express.Router();
// Importing function from the controller
const {
	getAvailableCourseBetweenTimeSlot,
	getSpecificCourseWithConsequence,
	getAllAvailableCourses,
	scoreTheCourse,
	getScoreAndDesc
} = require('../../controller/courses');

const { protect } = require('../../middleware/auth');

router.route('/').get(getAllAvailableCourses);
router.route('/getavailablebetweentime').get(getAvailableCourseBetweenTimeSlot);
router.route('/getSpecificCourseWithConsequence/:courseID').get(getSpecificCourseWithConsequence);

router.route('/score/:courseID').post(protect, scoreTheCourse);
router.route('/score/:courseID').get(getScoreAndDesc);
module.exports = router;
