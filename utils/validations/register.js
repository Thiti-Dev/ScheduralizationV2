const ErrorResponse = require('../errorResponse');
const { validate } = require('../validations');

const required_field = [
	{
		name: 'email',
		email: true,
		required: true
	},
	{
		name: 'password',
		min: 5,
		max: 30,
		required: true
	},
	{
		name: 'confirmPassword',
		matchWith: 'password',
		required: true
	},
	{
		name: 'firstName',
		required: true
	},
	{
		name: 'lastName',
		required: true
	},
	{
		name: 'studentID',
		required: true,
		fixLength: [ 11, `Invalid KMUTT's student-ID` ]
	}
];

module.exports = (req, res, next) => {
	const { isError, errors } = validate(required_field, req.body);

	if (isError) {
		return next(new ErrorResponse(`Validation Error`, 400, errors));
	}
	next();
};
