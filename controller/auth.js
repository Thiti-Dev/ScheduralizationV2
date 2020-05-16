const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
const sendTokenResponse = require('../utils/tokenResponse');
const sendEmail = require('../utils/sendEmail');
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── SOCKET IO ──────────────────────────────────────────────────────────────────
//
const _socketIO = require('../utils/socketio');
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

	// Gen the confirmToken
	const confirmToken = await user.getConfirmToken();
	await user.save(); // save first
	// Sending email confirmation
	try {
		// Create reset url
		const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/confirmemail/${confirmToken}`;
		const message = `Welcome to SchedularizationV2, in order to get your account working, please activate your account from clicking the link below: \n\n ${resetUrl}`;
		await sendEmail({ email: req.body.email, subject: 'Account confirmation', message });
	} catch (error) {
		console.log('[NODEMAILER]: There was a problem in sending email to ' + req.body.email);
	}
});

// @desc    Register user
// @route   POST /api/auth/confirmemail/:confirmtoken
// @acess   Public
exports.confirmEmail = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const confirmEmailToken = crypto.createHash('sha256').update(req.params.confirmtoken).digest('hex');
	console.log(confirmEmailToken);
	const user = await User.findOne({
		where: {
			confirmEmail: confirmEmailToken
		}
	});
	if (!user) {
		return next(new ErrorResponse(`Invalid token`, 400));
	}
	if (user.confirmedAt) {
		return next(new ErrorResponse(`Your account is already confirmed`, 400));
	}
	user.confirmedAt = new Date();
	const res_save = await user.save();
	_socketIO.emitToRoom(user.email, 'email-status', true);
	res.status(200).json({ success: true, data: res_save });
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
	if (!user.confirmedAt) {
		return next(new ErrorResponse(`The account isn't confirmed yet, please do the email confirmation first`, 401));
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
