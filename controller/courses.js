const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, CourseAvailable, Course, CourseScore, sequelize } = require('../models');
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

function distinctArrayOfObject(_data, _distinct_key, based_key) {
	const flagged_object_value = {}; // store an object
	const filtered_data = [];
	_data.forEach((data, index) => {
		if (!flagged_object_value[data[based_key]]) {
			flagged_object_value[data[based_key]] = {};
			_distinct_key.forEach((_col) => {
				flagged_object_value[data[based_key]][_col] = {}; // initialize entry for storing the flagged value
			});
		}
	});

	_data.forEach((data, index) => {
		let found_flagged = true; // default true
		_distinct_key.forEach((_col) => {
			if (!flagged_object_value[data[based_key]][_col][data[_col]]) {
				found_flagged = false;
			}
		});
		if (!found_flagged) {
			// push the one that isn't found flagged
			filtered_data.push(data);
			//flagged
			_distinct_key.forEach((_col) => {
				flagged_object_value[data[based_key]][_col][data[_col]] = true;
			});
		}
	});
	return filtered_data;
}
// ────────────────────────────────────────────────────────────────────────────────

// @desc    Get all available courses that exist in the database
// @route   GET /api/courses
// @acess   Public
exports.getAllAvailableCourses = asyncHandler(async (req, res, next) => {
	const courses = await Course.findAll({
		subQuery: false,
		order: [ [ 'courseID', 'ASC' ] ],
		include: [
			{
				model: CourseAvailable,
				as: 'courseAvailable',
				required: false
			}
		]
	});
	res.status(200).json({ success: true, data: courses });
});

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
			[Op.or]: [
				{ allowedGroup: { [Op.like]: '%' + allowedGroup + '%' } },
				{ allowedGroup: { [Op.like]: '%' + 'OTHER' + '%' } }
			]
		},
		include: [
			{
				model: Course,
				as: 'courseData'
			}
		]
	});
	const finalized_available = distinctArrayOfObject(course, [ 'start', 'end', 'day' ], 'section');
	res.status(200).json({ success: true, data: finalized_available });
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

// @desc    Give course a score&desc
// @route   POST /api/courses/score/:courseID
// @acess   Private
exports.scoreTheCourse = asyncHandler(async (req, res, next) => {
	const { courseID } = req.params;
	const { score, desc } = req.body;

	if (!score) {
		return next(
			new ErrorResponse(
				`Invalid request body, must have had score with the type of number(1-5) as a request query`
			)
		);
	}

	const course_score_exist = await CourseScore.findOne({
		where: {
			userId: req.user.id,
			courseID
		}
	});

	let course_scored;
	if (!course_score_exist) {
		course_scored = await CourseScore.create({
			courseID,
			score,
			description: desc || null,
			userId: req.user.id
		});
	} else {
		course_scored = await course_score_exist.update({
			score,
			description: desc || null
		});
	}

	res.status(200).json({ success: true, data: course_scored });
});

// @desc    Get course a score&desc
// @route   GET /api/courses/score/:courseID
// @acess   Public
exports.getScoreAndDesc = asyncHandler(async (req, res, next) => {
	const { courseID } = req.params;
	const course_score = await CourseScore.findAll({
		where: {
			courseID
		},
		include: [
			{
				model: User,
				as: 'userData',
				attributes: [ 'firstName', 'lastName', 'year', 'studentID' ]
			}
		]
	});
	res.status(200).json({ success: true, data: course_score });
});
