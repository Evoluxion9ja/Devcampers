const express = require('express');
const { fetchCourses, fetchCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const Router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

Router
    .route('/')
    .get(fetchCourses)
    .post(protect, authorize('admin', 'publisher'), createCourse)

Router
    .route('/:id')
    .get(fetchCourse)
    .put(protect, authorize('admin', 'publisher'), updateCourse)
    .delete(protect, authorize('admin', 'publisher'), deleteCourse)

module.exports = Router;