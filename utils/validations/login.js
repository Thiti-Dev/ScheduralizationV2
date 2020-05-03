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
		required: true
	}
];

module.exports = (req, res, next) => {
	const { isError, errors } = validate(required_field, req.body);

	if (isError) {
		return next(new ErrorResponse(`Validation Error`, 400, errors));
	}
	next();
};
