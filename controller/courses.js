const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { User, CourseAvailable, Course, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get the available courses from the given timeslot (also semester => allowedGroup)
// @route   GET /api/courses/getavailablebetweentime/:start/:end/:semester/:allowedGroup
// @acess   Public
exports.getAvailableCourseBetweenTimeSlot = asyncHandler(async (req, res, next) => {
	const { start, end, semester, allowedGroup } = req.params;

	if (!start || !end || !semester) {
		return next(
			new ErrorResponse(`Invalid params, must have had start,end,semester,allowedGroup with the type of string`)
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
			allowedGroup: {
				[Op.like]: '%' + allowedGroup + '%'
			}
		},
		include: [
			{
				model: Course,
				as: 'courseData'
			}
		]
	});
	res.status(200).json({ success: true, data: course });
});
