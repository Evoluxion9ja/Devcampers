const express = require('express');
const { fetchUsers, fetchUser, createUser, updateUser, deleteUser, uploadUserImage } = require('../controllers/users');
const Router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

Router.use(protect, authorize('admin'));

Router
    .route('/')
    .get(fetchUsers)
    .post(createUser)

Router
    .route('/:id')
    .get(fetchUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = Router;