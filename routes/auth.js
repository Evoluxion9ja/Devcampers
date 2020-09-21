const express = require('express');
const { registerUser, loginUser, fetchActiveUser, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');
const Router = express.Router();
const { protect, authorize } = require('../middleware/auth');

Router.route('/register').post(registerUser);
Router.route('/login').post(loginUser);
Router.route('/forgot-password').post(forgotPassword);
Router.route('/reset-password/:token').post(resetPassword);

Router.use(protect);

Router.route('/active-user').get(fetchActiveUser);
Router.route('/update-details').put(updateDetails);
Router.route('/update-password').put(updatePassword);

module.exports = Router;