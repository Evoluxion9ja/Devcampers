const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = asyncHandler(async (req, res, next) =>
{
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name, email, password, role
    });

    sendJwtResponse(user, 200, res);
})

exports.loginUser = asyncHandler(async (req, res, next) =>
{
    const { email, password } = req.body;

    if(!email || !password){
        return next(new ErrorResponse(`Please provide the registered email and valid password to have access to the account or reset Password`, 400));
    }

    const user = await User.findOne({ email }).select('password');

    if (!user) {
        return next(new ErrorResponse(`Hey, we noticed you are trying to login with an email that is not registered ${req.body.email} do you want to register?`,401));
    }

    const validPassword = await user.getValidPassword(password);

    if (!validPassword) {
        return next(new ErrorResponse(`You cannot have access to the page if the password provided isn incorrect. Please provide a correct password`, 400))
    }

    sendJwtResponse(user, 200, res);
})

exports.fetchActiveUser = asyncHandler(async (req, res, next) =>
{
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse(`The requested user is not registered in the database, please search for the right user information`, 400));
    }

    res.status(200).json({
        success: true,
        response: `This is the information on the currently active user`,
        user
    })
})

exports.forgotPassword = asyncHandler(async (req, res, next) =>
{

    if (!req.body.email) {
        return next(new ErrorResponse(`Please provide the registered email to receive a token for password change`, 400));
    }
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorResponse(`There is no user with the provided email ${req.body.email} found in the database, please check the email and try again`, 401));
    }

    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    const message = `
        <h1>Update Your Password</h1>
        <p>You are receiving this email because you (or someone else) requested to update you password, if you did not initiate this, please ignore or click the link below to update </p>
        <a href="${resetUrl}">UPDATE PASSWORD</a>
    `

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            html: message
        })
        res.status(200).json({
            success: true,
            response: `We have sent an email to ${user.email} email, please update your password through the provided link`
        })
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse(`It seem we are unable to send an email at the moment, please try again or reload the page to start all over again`));
    }

    // res.status(200).json({
    //     success: true,
    //     response: `We have sent you an email to ${req.body.email}, please click on the link to update your password or just ignore it`,
    //     data: {}
    // })
})

exports.resetPassword = asyncHandler(async (req, res, next) =>
{
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    
    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse(`There is no user with the provided token or credentials ${req.params.token} found in the database, please check and try again`, 401));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendJwtResponse(user, 200, res);
})

exports.updateDetails = asyncHandler(async (req, res, next) =>
{
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
        return next(new ErrorResponse(`You are not a member of devcampers, are you going to register or provide the valid information to update information`, 401));
    }

    await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    sendJwtResponse(user, 200, res);
})

exports.updatePassword = asyncHandler(async (req, res, next) =>
{
    const user = await User.findById(req.user.id).select('password');

    if (!user) {
        return next(new ErrorResponse(`You are not a member of devcampers, are you going to register or provide the valid information to update information`, 401));
    }

    if (!(await user.getValidPassword(req.body.currentPassword))) {
        return next(new ErrorResponse(`The password provided is incorrect`, 401));
    }

    user.password = req.body.newPassword;
    await user.save()

    sendJwtResponse(user, 200, res);
})

const sendJwtResponse = (user, statusCode, res) =>
{
    const token = user.getSignJwtToken();

    const options = {
        expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            response: `Your authentication was successful, Please have fun surfing our website. thank you so much`,
            token
    })
}