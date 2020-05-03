exports.information = (msg) => {
	let finalized_msg = '[INFO]'.bgCyan.italic + ': ' + msg.blue.bold;
	console.log(finalized_msg);
};

exports.debug = (msg) => {
	let finalized_msg = '[DEBUG]'.bgYellow.italic.red + ': ' + msg.red.bold;
	console.log(finalized_msg);
};
