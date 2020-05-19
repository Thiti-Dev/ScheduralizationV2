//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
import { isHavingDecimalPlaceThatGreaterThanZero } from '../../../utils/mathHelper';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── CONST ──────────────────────────────────────────────────────────────────────
//
const start_from = '8'; // 8.00 AM => the earliest time that the courses can be started
// ────────────────────────────────────────────────────────────────────────────────

export function convertClockTimeToMinutesFromStart(raw_time, _start_from = start_from) {
	const _based_hour = parseInt(raw_time.toString().split('.')[0]);

	let additional_from_custom_start_from = 0;
	let based_hour_start_from = 0;
	if (isHavingDecimalPlaceThatGreaterThanZero(parseFloat(_start_from))) {
		additional_from_custom_start_from = parseInt(_start_from.toString().split('.')[1]);
		based_hour_start_from = parseInt(_start_from.toString().split('.')[0]);
	} else {
		based_hour_start_from = parseInt(_start_from);
	}
	const _raw_time = _based_hour - based_hour_start_from;
	let addition_minute_value_needed = 0;
	if (isHavingDecimalPlaceThatGreaterThanZero(parseFloat(raw_time))) {
		addition_minute_value_needed = parseInt(raw_time.toString().split('.')[1]);
	}
	// if found decmimal places

	return Math.abs(_raw_time * 60 + addition_minute_value_needed - additional_from_custom_start_from); // minutes form
}

export function minusHourExactNoAdditionalMinuteRemail(_time, _hour) {
	const _calculatable_time = parseInt(_time) - _hour;
	let finalized_time;
	if (_calculatable_time < 10) {
		finalized_time = '0' + _calculatable_time + '.00';
	} else {
		finalized_time = _calculatable_time + '.00';
	}
	return finalized_time;
}
export function addHourExactNoAdditionalMinuteRemail(_time, _hour) {
	const _calculatable_time = parseInt(_time) + _hour;
	let finalized_time;
	if (_calculatable_time < 10) {
		finalized_time = '0' + _calculatable_time + '.00';
	} else {
		finalized_time = _calculatable_time + '.00';
	}
	return finalized_time;
}
