import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyRoles } from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import restaurantController from "../controllers/restaurantController.js";
import controller from "./controller.js";
import restaurantValidator from "./restaurant/restaurantValidator.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/getRestaurant/:restaurantId")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    restaurantController.getRestaurant
  );

  router
  .route("/search/:city")
  .get(
    restaurantValidator.searchRestaurantValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    restaurantController.searchRestaurant
  );

export default router;