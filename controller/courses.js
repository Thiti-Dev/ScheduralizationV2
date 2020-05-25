const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, CourseAvailable, Course, CourseScore, UserSchedule, sequelize } = require('../models');
const { Op } = require('sequelize');

//
// ─── UTILS FUNCTION ─────────────────────────────────────────────────────────────
//
async function checkIfCourseHavingConsequenceOrNot(courseID, section, start, end, semester = 2) {
	const courses = await CourseAvailable.findOne({
		where: {
			courseID,
			section,
			semester,
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
	/*let result = false; // Initialize as false
	if (courses.length > 0) {
		result = courses;
	}*/

	return courses;
}

function filterOutTheCoursesThatAlreadyAssign(assign_courses, available_courses) {
	const filtered_array = available_courses.filter((data) => {
		if (assign_courses.includes(data.courseID)) return false;
		return true;
	});
	return filtered_array;
}
// ────────────────────────────────────────────────────────────────────────────────

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
// @acess   Private
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
	const filtered_available = filterOutTheCoursesThatAlreadyAssign(req.user.learnedCourses, finalized_available);

	res.status(200).json({ success: true, data: filtered_available });
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

//
// ─── SCHEDULE ───────────────────────────────────────────────────────────────────
//

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
async function checkIfUserFreeAtPeriodOfTimeAndDay(start, end, day, userId) {
	const user_scheudles = await UserSchedule.findAll({
		where: {
			userId
		}
	});

	let is_free = true; // true by def

	if (user_scheudles.length > 0) {
		user_scheudles.forEach((data, index) => {
			if (data.day === day) {
				if (
					(data.start <= start && data.end >= end) ||
					(data.start >= start && data.end <= end) ||
					(data.end > start && end >= data.end) ||
					(data.start < end && start <= data.start)
				) {
					is_free = false;
				}
			}
		});
	}

	return is_free;
}
// ────────────────────────────────────────────────────────────────────────────────

// @desc    Assign a course for schedule
// @route   POST /api/courses/:courseID/assign
// @acess   Private
exports.assignSchedule = asyncHandler(async (req, res, next) => {
	const { courseID } = req.params;
	const { section } = req.body;
	const course_info = await CourseAvailable.findOne({
		where: {
			courseID,
			section,
			semester: req.user.semester
		}
	});
	if (!course_info) {
		return next(new ErrorResponse(`Courses ${courseID} with section ${section} isn't exist`, 404));
	}
	const consequence = await checkIfCourseHavingConsequenceOrNot(
		courseID,
		section,
		course_info.start,
		course_info.end,
		req.user.semester
	);

	// if not found consequence => easily just create new data
	if (!consequence) {
		const course__scheduled_exist = await UserSchedule.findOne({
			where: {
				userId: req.user.id,
				courseID,
				day: course_info.day,
				start: course_info.start,
				end: course_info.end
			}
		});

		// if already exist
		if (course__scheduled_exist) {
			return next(new ErrorResponse(`Already scheduled this course`, 400));
		}

		// CHECK IF USER IS FREE ON THAT DAY N TIME
		const is_free = await checkIfUserFreeAtPeriodOfTimeAndDay(
			course_info.start,
			course_info.end,
			course_info.day,
			req.user.id
		);

		if (!is_free) {
			return next(new ErrorResponse(`The user doesn't has any slot for this course`, 400));
		}
		// ─────────────────────────────────────────────────────────────────

		let course_scheduled;

		if (!course__scheduled_exist) {
			course_scheduled = await UserSchedule.create({
				courseID,
				day: course_info.day,
				start: course_info.start,
				end: course_info.end,
				userId: req.user.id
			});
		}
		/*else {
			course_scheduled = await course__scheduled_exist.update({
				courseID,
				day: course_info.day,
				start: course_info.start,
				end: course_info.end,
				userId: req.user.id
			});
		}*/

		return res.status(200).json({ success: true, data: course_scheduled, consequence: false });
	} else {
		// CHECK IF SCHEDULE EXIT (1) => based
		const course__scheduled_exist = await UserSchedule.findOne({
			where: {
				userId: req.user.id,
				courseID,
				day: course_info.day,
				start: course_info.start,
				end: course_info.end
			}
		});
		// CHECK IF SCHEDULE EXIT (1) => consequence
		const course__scheduled_exist_cq = await UserSchedule.findOne({
			where: {
				userId: req.user.id,
				courseID,
				day: consequence.day,
				start: consequence.start,
				end: consequence.end
			}
		});

		// If both seem to be existing in the record
		if (course__scheduled_exist && course__scheduled_exist_cq) {
			return next(new ErrorResponse(`Already scheduled this course`, 400));
		}

		// CHECK IF USER IS FREE ON THAT DAY N TIME
		const is_free = await checkIfUserFreeAtPeriodOfTimeAndDay(
			consequence.start,
			consequence.end,
			consequence.day,
			req.user.id
		);

		if (!is_free) {
			return next(new ErrorResponse(`The user doesn't has any slot for a consequence of this course`, 400));
		}

		// ─────────────────────────────────────────────────────────────────

		// CLEANING EXIST
		if (course__scheduled_exist) await course__scheduled_exist.destroy();
		if (course__scheduled_exist_cq) await course__scheduled_exist_cq.destroy();
		// ─────────────────────────────────────────────────────────────────

		// BULK CREATE (AFTER CLEANED)
		const courses_scheduled = await UserSchedule.bulkCreate([
			{
				courseID,
				day: course_info.day,
				start: course_info.start,
				end: course_info.end,
				userId: req.user.id
			},
			{
				courseID,
				day: consequence.day,
				start: consequence.start,
				end: consequence.end,
				userId: req.user.id
			}
		]);

		return res.status(200).json({ success: true, data: courses_scheduled, consequence: true });
	}
});

// @desc    Remove the assign courses
// @route   DELETE /api/courses/:courseID/assign
// @acess   Private
exports.deAssignSchedule = asyncHandler(async (req, res, next) => {
	const { courseID } = req.params;
	const schedule_remove = await UserSchedule.destroy({
		where: {
			userId: req.user.id,
			courseID
		}
	});
	res.status(200).json({ success: true, data: schedule_remove });
});

// ────────────────────────────────────────────────────────────────────────────────
