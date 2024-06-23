import express from "express";
import userController from "../controllers/userController.js";
import controller from "./controller.js";
import uservalidator from "./user/uservalidator.js";

const router = express.Router();

router
  .route("/register")
  .post(
    uservalidator.registerValidator(),
    controller.validate,
    userController.register
  );

export default router;
