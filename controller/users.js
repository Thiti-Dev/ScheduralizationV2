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
