const express = require('express');
const router = express.Router();
// Importing function from the controller
const {
	getSpecificData,
	updateStudiedCourses,
	getStudiedCoursesdDataFromString
} = require('../../controller/users.js');

const { protect } = require('../../middleware/auth');

router.route('/getSpecificData').get(protect, getSpecificData);
router.route('/updateStudiedCourses').put(protect, updateStudiedCourses);
router.route('/getstudiedcoursesdatafromstring').post(getStudiedCoursesdDataFromString);

module.exports = router;