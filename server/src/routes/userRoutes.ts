import { validateRequest, currentUser } from "../middlewares";
import express from "express"
import { body } from "express-validator"
import * as authController from "../controllers/authControllers"

const router = express.Router()

router.route("/signin").post([
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Yout must supply a password")
],
  validateRequest, authController.signin)

router.route("/signup").post([
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 charcters"),
  body("confirmPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("confirmPassword must be between 4 and 20 charcters")
],
  validateRequest, authController.signup)

router.route("/send-email").post(
  [
    body("email")
      .isEmail()
      .contains("ac.kr")
      .withMessage("must ac.kr"),
  ],
  validateRequest, authController.sendEmail)

router.route("/signout").post(authController.signout)

router.route("/currentuser").get(currentUser, authController.currentUser)

router.route('/forgotPassword').post();

router.route("/resetPassword/:token").patch()

router.route("/").get()

router
  .route("/:id")
  .get()
  .patch()
  .delete()

export default router;