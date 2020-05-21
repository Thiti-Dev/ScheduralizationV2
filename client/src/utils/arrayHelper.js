function distinctArrayOfObject(_data, _distinct_key) {
	const flagged_object_value = {}; // store an object
	const filtered_data = [];
	_distinct_key.forEach((_col) => {
		flagged_object_value[_col] = {}; // initialize entry for storing the flagged value
	});
	_data.forEach((data, index) => {
		let found_flagged = true; // default true
		_distinct_key.forEach((_col) => {
			if (!flagged_object_value[_col][data[_col]]) {
				found_flagged = false;
			}
		});
		if (!found_flagged) {
			// push the one that isn't found flagged
			filtered_data.push(data);
			//flagged
			_distinct_key.forEach((_col) => {
				flagged_object_value[_col][data[_col]] = true;
			});
		}
	});
	return filtered_data;
}
