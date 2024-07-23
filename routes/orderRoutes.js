import express from "express";
import orderController from "../controllers/orderController.js";
import controller from "./controller.js";
import orderValidator from "./order/orderValidator.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import ROLES_LIST from "../config/roles_list.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();

router
  .route("/checkout/webhook")
  .post(
    orderValidator.stripeWebhookHandlerValidator(),
    controller.validate,
    orderController.stripeWebhookHandler
  );

router.use(verifyJWT);

router
  .route("/checkout/create-checkout-session")
  .post(
    orderValidator.createCheckoutSessionValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    orderController.createCheckoutSession
  );

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner, ROLES_LIST.User),
    orderController.getMyOrders
  );
export default router;
