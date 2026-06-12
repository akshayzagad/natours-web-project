const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const express = require("express");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword,
);
router.get('/me',authController.protect,userController.getMe,userController.getUser);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);
/** Routes For Users */

router
  .route("/")
  .get(userController.getAllUsers)

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
