const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (req.cookies.token) {
		token = req.cookies.token;
	}

	// Make sure token exist
	if (!token) {
		return next(new ErrorResponse('Not authorize to access this route', 401));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		//console.log(decoded);

		req.user = await User.findByPk(decoded.id);

		// Checking again if the user_data got removed by somehow before the token expires
		if (!req.user) {
			return next(new ErrorResponse('Not authorize to access this route', 401));
		}

		//console.log(req.user);

		next();
	} catch (err) {
		console.log(err);
		return next(new ErrorResponse('Not authorize to access this route', 401));
	}
});
