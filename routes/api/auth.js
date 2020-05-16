const express = require('express');
const router = express.Router();
// Importing function from the controller
const { register, login, getProfileData, confirmEmail } = require('../../controller/auth');

const { protect } = require('../../middleware/auth');

// @desc Importing validator
const validateRegister = require('../../utils/validations/register');
const validateLogin = require('../../utils/validations/login');
router.route('/').post(validateRegister, register).get(protect, getProfileData);
router.route('/login').post(validateLogin, login);
router.route('/confirmemail/:confirmtoken').get(confirmEmail);
module.exports = router;
