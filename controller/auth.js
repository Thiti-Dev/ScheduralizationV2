const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
const sendTokenResponse = require('../utils/tokenResponse');
// ────────────────────────────────────────────────────────────────────────────────

// @desc    Register user
// @route   POST /api/auth/
// @acess   Public
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

// @desc    Login user
// @route   POST /api/auth/login
// @acess   Public
exports.login = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({
		where: {
			email: req.body.email
		}
	});
	if (!user) {
		return next(new ErrorResponse(`Invalid credentials`, 400));
	}
	if (!await user.matchPassword(req.body.password)) {
		return next(new ErrorResponse(`Invalid credentials`, 400));
	}
	// Exclude the field after checked from above
	user.password = undefined;
	//res.status(200).json({ success: true, data: user });
	sendTokenResponse(user, 200, res);
});

// @desc    Get user credential (get Profile Data)
// @route   GET /api/auth
// @acess   Private
exports.getProfileData = asyncHandler(async (req, res, next) => {
	const user = await User.findByPk(req.user.id, {
		attributes: {
			exclude: [ 'password' ]
		}
	});
	if (!user) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}
	res.status(200).json({ success: true, data: user });
});
