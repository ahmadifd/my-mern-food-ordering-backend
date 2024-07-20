import express from "express";
import myRestaurantController from "../controllers/myRestaurantController.js";
import controller from "./controller.js";
import myRestaurantValidator from "./myRestaurant/myRestaurantValidator.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import ROLES_LIST from "../config/roles_list.js";
import { verifyRoles } from "../middleware/verifyRoles.js";
import multer from "multer";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.use(verifyJWT);

router
  .route("/editRestaurant")
  .put(
    upload.fields([{ name: "imageFile", maxCount: 1 }]),
    myRestaurantValidator.editRestaurantValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    myRestaurantController.editRestaurant
  );

router.route("/createRestaurant").post(
  upload.fields([{ name: "imageFile", maxCount: 1 }]),
  myRestaurantValidator.createRestaurantValidator(),
  controller.validate,
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
  myRestaurantController.createRestaurant
);

router
  .route("/getRestaurant")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    myRestaurantController.getRestaurant
  );
export default router;
