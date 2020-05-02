const _ = require('lodash');

//
// ─── REGEX ──────────────────────────────────────────────────────────────────────
//
const Regex_Email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── CORE ───────────────────────────────────────────────────────────────────────
//
exports.validate = (_require_fields, req_body) => {
	const errors = {};
	let isError = false;
	for (let field of _require_fields) {
		const { min, max } = field;
		//Check if the required field is entered
		if (field.required && !req_body[field.name]) {
			errors[field.name] = `${field.name} is required`;
			continue;
		} else {
			if (typeof req_body[field.name] === 'string') {
				const value = req_body[field.name];
				if (field.min) {
					// checking if proceed the min length
					if (value.length < min) {
						errors[field.name] = `${field.name} requires minimum of ${min} characters`;
					}
				}
				if (field.max) {
					if (value.length > max) {
						errors[field.name] = `${field.name} requires maximum of ${max} characters`;
					}
				}
			}
			// Checking if matching with the one the being referenced
			if (field.matchWith) {
				if (req_body[field.matchWith] !== req_body[field.name]) {
					errors[field.name] = `${field.name} isn't match with ${field.matchWith}`;
				}
			}
			// If email check needed
			if (field.email && field.required) {
				if (!Regex_Email.test(req_body[field.name])) {
					errors[field.name] = `Invalid email format`;
				}
			}
			if (field.fixLength) {
				// if the argument contains custom error msg
				if (Array.isArray(field.fixLength)) {
					if (req_body[field.name].length !== field.fixLength[0]) {
						errors[field.name] = field.fixLength[1];
					}
				} else {
					errors[field.name] = `${field.name} must have ${field.fixLength} characters`;
				}
			}
		}
	}
	return { isError: !_.isEmpty(errors), errors };
};
// ────────────────────────────────────────────────────────────────────────────────
