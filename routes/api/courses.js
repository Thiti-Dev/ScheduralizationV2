const express = require('express');
const router = express.Router();
// Importing function from the controller
const { getAvailableCourseBetweenTimeSlot, getSpecificCourseWithConsequence } = require('../../controller/courses');

const { protect } = require('../../middleware/auth');

router.route('/getavailablebetweentime/:start/:end/:semester/:allowedGroup').get(getAvailableCourseBetweenTimeSlot);
router.route('/getSpecificCourseWithConsequence/:courseID').get(getSpecificCourseWithConsequence);
module.exports = router;
