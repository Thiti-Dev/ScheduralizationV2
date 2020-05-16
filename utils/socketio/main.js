//
// ─── SOCKET ─────────────────────────────────────────────────────────────────────
//
const socketIO = require('socket.io');
// ────────────────────────────────────────────────────────────────────────────────

// Sigleton needed
var io = null;

function initialize(server) {
	io = socketIO.listen(server);
	// Waiting for the peer to be connected
	io.on('connection', (client) => {
		console.log('user connected');

		client.on('room', function(room) {
			client.join(room, function() {
				console.log(`[SOCKET.IO] => [${room}]: 1 peer connected this rooom`);
			});
		});

		// When some of the peers disconnect
		client.on('disconnect', () => {
			console.log('user disconnected');
		});

		// Listener from peers
		client.on('sent-message', function(message) {
			// Emit all to the active peers
			io.sockets.emit('new-message', message);
		});
	});
}

function emitToRoom(room, event, data) {
	io.to(room).emit(event, data);
}

module.exports = {
	initialize,
	emitToRoom
};
