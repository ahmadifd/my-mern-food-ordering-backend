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

router
  .route("/editUser/:id")
  .patch(
    uservalidator.editUserValidator(),
    controller.validate,
    userController.editUser
  );

router
  .route("/getUser/:email")
  .get(
    uservalidator.getUserValidator(),
    controller.validate,
    userController.getUser
  );
export default router;
