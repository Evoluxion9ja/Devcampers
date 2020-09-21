const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

exports.fetchUsers = asyncHandler(async (req, res, next) =>
{
    const users = await User.find();
    res.status(200).json({
        success: true,
        response: `Just take a look at all the users available in the database...`,
        count: users.length,
        data: users
    })
})

exports.fetchUser = asyncHandler(async (req, res, next) =>
{
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new ErrorResponse(`You seem to be trying to get an information on a user that does not exist in the database, please try again later`))
    }

    res.status(200).json({
        success: true,
        response: `Giving you an information on the selected resource ${req.params.id} is always a thing of joy`,
        user
    })
})

exports.createUser = asyncHandler(async (req, res, next) =>
{
    const user = await User.create(req.body);

    res.status(200).json({
        success: true,
        response: `Go ahead and make sure you have something available in the store, especially new ones`,
        user
    })
})

exports.updateUser = asyncHandler(async (req, res, next) =>
{
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`You seem to be trying to get an information on a user that does not exist in the database, please try again later`))
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        response: `An update to the selected resource ${req.params.id} was done successfully, do you want to see it?`,
        user
    })
})

exports.deleteUser = asyncHandler(async (req, res, next) =>
{
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`You seem to be trying to get an information on a user that does not exist in the database, please try again later`))
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        response: `It is not a thing of joy to see this resource ${req.params.id} been removed from the store. but we just have to do our job`,
        data: {}
    })
})

exports.uploadUserImage = asyncHandler(async (req, res, next) =>
{
    res.status(200).json({
        success: true,
        response: `People are usually attracted by whatever they see, so we have added an image to make the resource look beautiful`,
        data: {}
    })
})