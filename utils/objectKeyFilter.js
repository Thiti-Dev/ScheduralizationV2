module.exports = (rawField, allowed_field) => {
	const filtered_obj = {};
	for (let [ key, value ] of Object.entries(rawField)) {
		if (allowed_field.includes(key)) {
			filtered_obj[key] = value;
		}
	}
	return filtered_obj;
};
