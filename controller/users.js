const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, Course, CourseScore, UserSchedule } = require('../models');

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
const objectKeyFilter = require('../utils/objectKeyFilter');
const sendTokenResponse = require('../utils/tokenResponse');
// ────────────────────────────────────────────────────────────────────────────────

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

// @desc    Update specific data of the current user
// @route   PATCH /api/users/updatespecificdata
// @acess   Private
exports.updateSpecificData = asyncHandler(async (req, res, next) => {
	const user = await User.findByPk(req.user.id);
	if (!user) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}
	const filtered_updated_data = objectKeyFilter(req.body, [
		'firstName',
		'lastName',
		'studentID',
		'year',
		'semester',
		'studentGroup'
	]); // Allowed field that can be updated
	//
	// ─── UPDATING THE MODEL INSTANCE ────────────────────────────────────────────────
	//
	await user.update(filtered_updated_data); // updating
	// ────────────────────────────────────────────────────────────────────────────────

	//res.status(200).json({ success: true });
	sendTokenResponse(user, 200, res);
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

	//res.status(200).json({ success: true, data: finalized_courses_plain_str });
	sendTokenResponse(user_data, 200, res);
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

	//res.status(200).json({ success: true });
	sendTokenResponse(user, 200, res);
});

// @desc    Get joined data of all of the study courses from plain string(separator) and join with the course score data
// @route   GET /api/users/getstudiedcoursesdatafromstringwithscoredata
// @acess   Private
exports.getStudiedCoursesWithScoreData = asyncHandler(async (req, res, next) => {
	const courses_plain_str = req.user.learnedCourses;

	//
	// ─── Data(Mess) cleanner
	//
	const finalized_courses_plain_array = courses_plain_str.split(',').filter(Boolean);
	// ────────────────────────────────────────────────────────────────────────────────
	const courses = await Course.findAll({
		where: {
			courseID: finalized_courses_plain_array
		},
		subQuery: false,
		order: [ [ 'courseID', 'ASC' ] ],
		include: [
			{
				model: CourseScore,
				as: 'courseScoring',
				where: {
					userId: req.user.id
				},
				required: false
			}
		]
	});
	res.status(200).json({ success: true, data: courses });
});

// @desc    Change year/semester
// @route   PUT /api/users/switch
// @acess   Private
exports.changeYearAndSemester = asyncHandler(async (req, res, next) => {
	const { year, semester } = req.body;
	if (!year || !semester) {
		return next(
			new ErrorResponse(`To be initializing the user, year&semester must be passed into the request body`, 400)
		);
	}
	const user = await User.findByPk(req.user.id);
	if (!user) {
		return next(new ErrorResponse(`Your account isn't found on the database`, 400));
	}

	// Updating
	user.year = year;
	user.semester = semester;
	await user.save();
	// ────────────────────────────────────────────────────────────────────────────────

	// REMOVE ALL SCHEDULE
	await UserSchedule.destroy({
		where: {
			userId: req.user.id
		}
	});
	// --------------------

	//res.status(200).json({ success: true });
	sendTokenResponse(user, 200, res);
});
