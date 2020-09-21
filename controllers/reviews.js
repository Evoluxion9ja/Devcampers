const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

exports.fetchReviews = asyncHandler(async (req, res, next) =>
{
    let query;
    if (req.params.bootcampId) {
        query = await Review.find({ bootcamp: req.params.bootcampId }).populate({
            path: 'bootcamp',
            select: 'name description'
        })
        const reviews = query
        res.status(200).json({
            success: true,
            response: `Just take a look at all the resources available for the bootcamp ${req.params.bootcampId} in the database...`,
            count: reviews.length,
            data: reviews
        })
    } else {
        query = await Review.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
        const reviews = query
        res.status(200).json({
            success: true,
            response: `Just take a look at all the resources available in the database...`,
            count: reviews.length,
            data: reviews
        })
    }
})

exports.fetchReview = asyncHandler(async (req, res, next) =>
{
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`The requested review is currently not available or associated with any bootcamp`, 401))
    }

    res.status(200).json({
        success: true,
        response: `Giving you an information on the selected resource ${req.params.id} is always a thing of joy`,
        data: review
    })
})

exports.createReview = asyncHandler(async (req, res, next) =>
{
    req.body.user = req.user.id;
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`The bootcamp requested for is currently not available in the database`, 401))
    }
    
    const review = await Review.create(req.body);

    res.status(200).json({
        success: true,
        response: `Go ahead and make sure you have something available in the store, especially new ones`,
        data: review
    })
})

exports.updateReview = asyncHandler(async (req, res, next) =>
{
    res.status(200).json({
        success: true,
        response: `An update to the selected resource ${req.params.id} was done successfully, do you want to see it?`,
        data: {}
    })
})

exports.deleteReview = asyncHandler(async (req, res, next) =>
{
    res.status(200).json({
        success: true,
        response: `It is not a thing of joy to see this resource ${req.params.id} been removed from the store. but we just have to do our job`,
        data: {}
    })
})