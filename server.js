const express = require('express');
const dotenv = require('dotenv');
const app = express();

const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');

// importing database
const models = require('./models');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Importing route
const auth = require('./routes/api/auth');
// @Apply route
app.use('/api/auth', auth);

// @Error Hander
app.use(errorHandler);

// Establish the Sequelize connection with the database
models.sequelize
	.authenticate()
	.then(function() {
		console.log('Connection successful');
	})
	.catch(function(error) {
		console.log('Error creating connection:', error);
	});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`The server is currently running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
