const express = require('express');
const routes = express.Router();
const registerController  = require('../controllers/register-controller');
const loginController = require('../controllers/login-controller');
const userController = require('../controllers/user-controller');
// register api routes start
routes.post('/api/register', registerController.registerUser);
routes.post('/api/social-login', registerController.socialLogin);
routes.post('/api/verify-otp', registerController.verifyOtp);
routes.post('/api/resend-otp', registerController.resendOtp);

//login routes start
routes.post('/api/login', loginController.userLogin);

//forgot password routes start
routes.post('/api/forgot-password', loginController.forgotPassword);
routes.get('/reset/:token',loginController.resetPassword);
routes.post('/reset-password',loginController.ResetpasswordNow);


//user controller routes start
routes.post('/api/fetch-profile', userController.fetchProfile);
routes.post('/api/change-password', userController.changePassword);
routes.post('/api/upload-profile-image', userController.uploadProfileImage);
routes.post('/api/update-profile', userController.updateProfile);
routes.post('/api/add-user-info', userController.userInfo);


module.exports = routes;