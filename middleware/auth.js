const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) =>
{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        return next(new ErrorResponse(`Wow! How come you are trying to access this page when you are not authenticated? Please login or register if you don't already have an account`, 401));
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);
        next();
    }
    catch (err) {
        return next(new ErrorResponse(`Wow! How come you are trying to access this page when you are not authenticated? Please login or register if you don't already have an account`, 401));
    }
})

exports.authorize = (...roles) =>
{
    return asyncHandler(async (req, res, next) =>
    {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`You are trying to access a page which is not accessible by ${req.user.role}. Please contact the admin for more information`))
        }
        next();
    })
}