const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

exports.register = asyncHandler(async (req, res, next) => {
	const user = await User.create({
		email: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		studentID: req.body.studentID
	});
	res.status(200).json({ success: true, data: user });
});
