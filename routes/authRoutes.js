import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";
import authvalidator from "./auth/authvalidator.js";
import authController from "../controllers/authController.js";
import controller from "../routes/controller.js";

const router = express.Router();

router
  .route("/login")
  .post(
    loginLimiter,
    authvalidator.loginValidator(),
    controller.validate,
    authController.login
  );

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

export default router;
