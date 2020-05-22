const express = require('express');
const dotenv = require('dotenv');
const app = express();

const colors = require('colors');

const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');

//
// ─── SOCKET IO ──────────────────────────────────────────────────────────────────
//
const _socketIO = require('./utils/socketio/');
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
const formattedLog = require('./utils/formatted-log');
// ────────────────────────────────────────────────────────────────────────────────

// importing database
const models = require('./models');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Importing route
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const courses = require('./routes/api/courses');
// @Apply route
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/courses', courses);

// @Error Hander
app.use(errorHandler);

// Establish the Sequelize connection with the database
models.sequelize
	.authenticate()
	.then(function() {
		formattedLog.information(`Sequelize successfully connected`);
	})
	.catch(function(error) {
		formattedLog.information('Error creating connection:', error);
	});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	formattedLog.information(`The server is currently running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize socket.io from server
_socketIO.initialize(server);
