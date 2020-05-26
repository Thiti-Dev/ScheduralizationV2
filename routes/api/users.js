const express = require('express');
const router = express.Router();
// Importing function from the controller
const {
	getSpecificData,
	updateStudiedCourses,
	getStudiedCoursesdDataFromString,
	initializeNewUser,
	updateSpecificData,
	getStudiedCoursesWithScoreData,
	changeYearAndSemester
} = require('../../controller/users.js');

const { protect } = require('../../middleware/auth');

router.route('/getSpecificData').get(protect, getSpecificData);
router.route('/updateSpecificData').patch(protect, updateSpecificData);
router.route('/updateStudiedCourses').put(protect, updateStudiedCourses);
router.route('/getstudiedcoursesdatafromstring').post(getStudiedCoursesdDataFromString);
router.route('/getstudiedcoursesdatafromstringwithscoredata').get(protect, getStudiedCoursesWithScoreData);
router.route('/initialize').put(protect, initializeNewUser);
router.route('/switch').put(protect, changeYearAndSemester);

module.exports = router;
