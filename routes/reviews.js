const express = require('express');
const { fetchReviews, fetchReview, createReview, updateReview, deleteReview } = require('../controllers/reviews');
const Router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

Router
    .route('/')
    .get(fetchReviews)
    .post(protect, authorize('user', 'admin'), createReview)

Router
    .route('/:id')
    .get(fetchReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = Router;