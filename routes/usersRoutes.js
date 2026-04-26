const userController = require('../controllers/userController')

const express = require('express')

const router = express.Router();

/** Routes For Users */

router.route('/').get(userController.getAllUsers).post(userController.createUsers);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router; 