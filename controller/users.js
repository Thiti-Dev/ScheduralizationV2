const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

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
