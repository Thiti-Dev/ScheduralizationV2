const express = require('express');
const router = express.Router();
// Importing function from the controller
const { register, login } = require('../../controller/auth');

// @desc Importing validator
const validateRegister = require('../../utils/validations/register');

router.route('/').post(validateRegister, register);

module.exports = router;
