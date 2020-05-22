const express = require('express');
const router = express.Router();
// Importing function from the controller
const { getSpecificData } = require('../../controller/users.js');

const { protect } = require('../../middleware/auth');

router.route('/getSpecificData').get(protect, getSpecificData);

module.exports = router;
