import express from "express";
import userController from "../controllers/userController.js";
import controller from "./controller.js";
import uservalidator from "./user/uservalidator.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import ROLES_LIST from "../config/roles_list.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();

router
  .route("/register")
  .post(
    uservalidator.registerValidator(),
    controller.validate,
    userController.register
  );

router.use(verifyJWT);

router
  .route("/editUser/:id")
  .patch(
    uservalidator.editUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager, ROLES_LIST.User),
    userController.editUser
  );

router
  .route("/getUser/:id")
  .get(
    uservalidator.getUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager, ROLES_LIST.User),
    userController.getUser
  );
export default router;
