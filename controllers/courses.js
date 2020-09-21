const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');

exports.fetchCourses = asyncHandler(async (req, res, next) =>
{
    let query;

    if (req.params.bootcampId) {
        query = await Course.find({ bootcamp: req.params.bootcampId }).populate({
            path: 'bootcamp',
            select: 'name description'
        })

        const courses = query

        res.status(200).json({
            success: true,
            response: `Just take a look at all the resources available for the selected bootcamp in the database...`,
            count: courses.length,
            data: courses
        })
    } else {
        query = await Course.find().populate({
            path: 'bootcamp',
            select: 'name, description'
        })

        const courses = query;
        res.status(200).json({
            success: true,
            response: `Just take a look at all the resources available in the database...`,
            count: courses.length,
            data: courses
        })
    }
})

exports.fetchCourse = asyncHandler(async (req, res, next) =>
{
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`The requested Course with the ID ${req.params.id} is not available in the database`));
    }

    res.status(200).json({
        success: true,
        response: `Giving you an information on the selected resource ${req.params.id} is always a thing of joy`,
        data: course
    })
})

exports.createCourse = asyncHandler(async (req, res, next) =>
{
    req.body.user = req.user.id;
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`You cannot create a course for a bootcamp ${req.params.bootcampId} which is not available in the database`));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        response: `Go ahead and make sure you have something available in the store, especially new ones`,
        data: course
    })
})

exports.updateCourse = asyncHandler(async (req, res, next) =>
{
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`The requested Course with the ID ${req.params.id} is not available in the database`));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`You can only make changes to this course if you have the authorization to do so`));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        response: `An update to the selected resource ${req.params.id} was done successfully, do you want to see it?`,
        data: course
    })
})

exports.deleteCourse = asyncHandler(async (req, res, next) =>
{
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`The requested Course with the ID ${req.params.id} is not available in the database`));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`You can only make changes to this course if you have the authorization to do so`));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        response: `It is not a thing of joy to see this resource ${req.params.id} been removed from the store. but we just have to do our job`,
        data: {}
    })
})