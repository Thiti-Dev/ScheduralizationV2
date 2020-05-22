const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, Course } = require('../models');

// @desc    Get specific data of the current user
// @route   GET /api/users/getspecificdata?field=learnedCourses,password
// @acess   Private
exports.getSpecificData = asyncHandler(async (req, res, next) => {
	const { field } = req.query;
	if (!field) {
		return next(new ErrorResponse(`You've to specific the field, by passing field query`, 400));
	}
	const splited_wanted_field = field.split(',');
	const user_data = await User.findByPk(req.user.id, {
		attributes: splited_wanted_field
	});
	if (!user_data) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}

	// Refrain from some field
	user_data.password = undefined;
	// ────────────────────────────────────────────────────────────────────────────────

	res.status(200).json({ success: true, data: user_data });
});

// @desc    Get specific data of the current user
// @route   PUT /api/users/updateStudiedCourses
// @acess   Private
exports.updateStudiedCourses = asyncHandler(async (req, res, next) => {
	const { courses_plain_str } = req.body;
	if (!courses_plain_str && courses_plain_str !== '') {
		return next(new ErrorResponse(`Missing request body (courses_plain_str)`, 400));
	}
	const user_data = await User.findByPk(req.user.id);
	if (!user_data) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}
	//
	// ─── Data(Mess) cleanner
	//
	const finalized_courses_plain_str = courses_plain_str.split(',').filter(Boolean).join(',');
	// ────────────────────────────────────────────────────────────────────────────────

	user_data.learnedCourses = finalized_courses_plain_str;

	await user_data.save();

	res.status(200).json({ success: true, data: finalized_courses_plain_str });
});

// @desc    Get joined data of all of the study courses from plain string(separator)
// @route   POST /api/users/getstudiedcoursesdatafromstring
// @acess   Public
exports.getStudiedCoursesdDataFromString = asyncHandler(async (req, res, next) => {
	const { courses_plain_str } = req.body;
	if (!courses_plain_str && courses_plain_str !== '') {
		return next(new ErrorResponse(`Missing request body (courses_plain_str)`, 400));
	}
	//
	// ─── Data(Mess) cleanner
	//
	const finalized_courses_plain_array = courses_plain_str.split(',').filter(Boolean);
	// ────────────────────────────────────────────────────────────────────────────────
	const courses = await Course.findAll({
		where: {
			courseID: finalized_courses_plain_array
		}
	});
	res.status(200).json({ success: true, data: courses });
});

// @desc    Initialize for the new user (year,semester,studentGroup)
// @route   PUT /api/users/initialize
// @acess   Private
exports.initializeNewUser = asyncHandler(async (req, res, next) => {
	const { year, semester, studentGroup } = req.body;
	if (!year || !semester || !studentGroup) {
		return next(
			new ErrorResponse(
				`To be initializing the user, year&semester&studentGroup must be passed into the request body`,
				400
			)
		);
	}
	const user = await User.findByPk(req.user.id);
	if (!user) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}

	// Updating
	user.year = year;
	user.semester = semester;
	user.studentGroup = studentGroup;
	await user.save();
	// ────────────────────────────────────────────────────────────────────────────────

	res.status(200).json({ success: true });
});
