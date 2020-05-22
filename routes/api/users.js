const express = require('express');
const router = express.Router();
// Importing function from the controller
const {
	getSpecificData,
	updateStudiedCourses,
	getStudiedCoursesdDataFromString,
	initializeNewUser,
	updateSpecificData
} = require('../../controller/users.js');

const { protect } = require('../../middleware/auth');

router.route('/getSpecificData').get(protect, getSpecificData);
router.route('/updateSpecificData').patch(protect, updateSpecificData);
router.route('/updateStudiedCourses').put(protect, updateStudiedCourses);
router.route('/getstudiedcoursesdatafromstring').post(getStudiedCoursesdDataFromString);
router.route('/initialize').put(protect, initializeNewUser);

module.exports = router;
