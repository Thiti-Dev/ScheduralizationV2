export function precision(a) {
	if (!isFinite(a)) return 0;
	var e = 1,
		p = 0;
	while (Math.round(a * e) / e !== a) {
		e *= 10;
		p++;
	}
	return p;
}

export function isHavingDecimalPlaceThatGreaterThanZero(target_val) {
	if (precision(target_val) < 1) {
		return false;
	}
	//const decimal_value = parseFloat(target_val.toString().split('.')[1])
	return true;
}
