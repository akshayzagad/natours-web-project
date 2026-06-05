const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const express = require('express')

const router = express.Router();

router.post('/signUp',authController.signUp);
router.post('/login',authController.login);

/** Routes For Users */

router.route('/').get(userController.getAllUsers).post(userController.createUsers);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router; 