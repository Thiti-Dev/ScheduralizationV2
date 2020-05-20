const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, CourseAvailable, Course, sequelize } = require('../models');
const { Op } = require('sequelize');

//
// ─── UTILS FUNCTION ─────────────────────────────────────────────────────────────
//
async function checkIfCourseHavingConsequenceOrNot(courseID, section, start, end) {
	const courses = await CourseAvailable.findAll({
		where: {
			courseID,
			section,
			start: {
				[Op.ne]: start
			},
			end: {
				[Op.ne]: end
			}
		},
		include: [
			{
				model: Course,
				as: 'courseData'
			}
		]
	});
	let result = false; // Initialize as false
	if (courses.length > 0) {
		result = courses;
	}

	return result;
}
// ────────────────────────────────────────────────────────────────────────────────

// @desc    Get the available courses from the given timeslot (also semester => allowedGroup)
// @route   GET /api/courses/getavailablebetweentime?start=10.30&end=12.30&semester=2&allowedGroup=CSS
// @acess   Public
exports.getAvailableCourseBetweenTimeSlot = asyncHandler(async (req, res, next) => {
	const { start, end, semester, allowedGroup } = req.query;

	if (!start || !end || !semester || !allowedGroup) {
		return next(
			new ErrorResponse(
				`Invalid params, must have had start,end,semester,allowedGroup with the type of string as a query string`
			)
		);
	}

	const course = await CourseAvailable.findAll({
		where: {
			start: {
				[Op.gte]: start
			},
			end: {
				[Op.lte]: end
			},
			semester,
			allowedGroup: {
				[Op.like]: '%' + allowedGroup + '%'
			}
		},
		include: [
			{
				model: Course,
				as: 'courseData'
			}
		]
	});
	res.status(200).json({ success: true, data: course });
});

// @desc    Get the consequence of the specific course
// @route   GET /api/courses/getSpecificCourseWithConsequence/:courseID?section=1&start=10.30&stop=12.30
// @acess   Public
exports.getSpecificCourseWithConsequence = asyncHandler(async (req, res, next) => {
	const { courseID } = req.params;
	const { section, start, stop } = req.query;

	if (!courseID || !section || !start || !stop) {
		return next(
			new ErrorResponse(
				`Invalid params, must have had section,start,stop with the type of string as a request query`
			)
		);
	}
	const conflicted_data = await checkIfCourseHavingConsequenceOrNot(courseID, section, start, stop);
	res.status(200).json({ success: true, data: conflicted_data });
});
