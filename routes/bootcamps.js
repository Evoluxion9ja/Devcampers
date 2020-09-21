const express = require('express');
const { fetchBootcamps, fetchBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, uploadBootcampImage } = require('../controllers/bootcamps');
const Router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

Router.use('/:bootcampId/courses', courseRouter);
Router.use('/:bootcampId/reviews', reviewRouter);
Router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), uploadBootcampImage);

Router
    .route('/')
    .get(fetchBootcamps)
    .post(protect, authorize('admin', 'publisher'), createBootcamp)

Router
    .route('/:id')
    .get(fetchBootcamp)
    .put(protect, authorize('admin', 'publisher'), updateBootcamp)
    .delete(protect, authorize('admin', 'publisher'), deleteBootcamp)

module.exports = Router;