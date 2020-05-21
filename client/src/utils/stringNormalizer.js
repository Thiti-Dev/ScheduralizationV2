export function splitRequiredCourseToNormalizeText(raw_txt) {
	let result = raw_txt.replace(/\//g, ' หรือ ');
	result = result.replace(/,/g, ' และ ');
	return result;
}
