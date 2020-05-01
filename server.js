const express = require('express');
const dotenv = require('dotenv');
const app = express();

// Load env vars
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`The server is currently running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
