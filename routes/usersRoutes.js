const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const express = require('express')

const router = express.Router();

router.post('/signUp',authController.signUp);
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updateMyPassword',authController.protect, authController.updatePassword);
/** Routes For Users */

router.route('/').get(userController.getAllUsers).post(userController.createUsers);

// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router; 