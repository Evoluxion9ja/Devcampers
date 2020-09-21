const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

exports.fetchBootcamps = asyncHandler(async (req, res, next) =>
{
    const bootcamps = await Bootcamp.find().populate('courses');
    res.status(200).json({
        success: true,
        response: `Just take a look at all the resources available in the database...`,
        count: bootcamps.length,
        data: bootcamps
    })
})

exports.fetchBootcamp = asyncHandler(async (req, res, next) =>
{
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

    if (!bootcamp) {
        return next(new ErrorResponse(`The requested bootcamp with the id ${req.params.id} is not available in the database`))
    }

    res.status(200).json({
        success: true,
        response: `Giving you an information on the selected resource ${req.params.id} is always a thing of joy`,
        data: bootcamp
    })
})

exports.createBootcamp = asyncHandler(async (req, res, next) =>
{
    req.body.user = req.user.id;

    const createdBootcamp = await Bootcamp.findOne({ user: req.user.id });

    if (createdBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`You can only create just one bootcamp as a ${req.user.role}, please contact the admin for mor information`))
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({
        success: true,
        response: `Go ahead and make sure you have something available in the store, especially new ones`,
        data: bootcamp
    })
})

exports.updateBootcamp = asyncHandler(async (req, res, next) =>
{
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`The requested bootcamp with the id ${req.params.id} is not available in the database`))
    }

    if (!bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Only the admin is given the authorization to edit this bootcamp, contact the admin for more information`))
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        response: `An update to the selected resource ${req.params.id} was done successfully, do you want to see it?`,
        data: bootcamp
    })
})

exports.deleteBootcamp = asyncHandler(async (req, res, next) =>
{
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`The requested bootcamp with the id ${req.params.id} is not available in the database`))
    }

    if (!bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Only the admin is given the authorization to edit this bootcamp, contact the admin for more information`))
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        response: `It is not a thing of joy to see this resource ${req.params.id} been removed from the store. but we just have to do our job`,
        data: {}
    })
})

exports.uploadBootcampImage = asyncHandler(async (req, res, next) =>
{
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`The requested bootcamp with the id ${req.params.id} is not available in the database`))
    }

    if (!bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Only the admin is given the authorization to edit this bootcamp, contact the admin for more information`))
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please make sure you have selected an image to be uploaded for the bootcamp`));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`The file selected for upload should be strictly an image file that can either be a (JPEG, JPG, PNG, GIF< SVG)`));
    }

    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new ErrorResponse(`You are only allowed to upload an image or file below ${process.env.MAX_FILE_SIZE} bytes (2MB) of file size`));
    }

    const file_name = `BOOTCAMP_PHOTO - ${Date.now()}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_PATH}/${file_name}`, async err =>
    {
        if (err) {
            return next(new ErrorResponse(`There was an error in the process of uploading the image, please try again later`, 400))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file_name });
    })

    res.status(200).json({
        success: true,
        response: `People are usually attracted by whatever they see, so we have added an image to make the resource look beautiful`,
        data: file_name
    })
})