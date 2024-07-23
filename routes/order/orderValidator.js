import expressValidator from "express-validator";

const check = expressValidator.check;

const createCheckoutSessionValidator = () => {
  return [
    check("cartItems")
      .isArray({ min: 1 })
      .withMessage("cartItems cant be empty"),
    check("cartItems.*.menuItemId")
      .not()
      .isEmpty()
      .withMessage("cartItems's menuItemId cant be empty"),
    check("cartItems.*.name")
      .not()
      .isEmpty()
      .withMessage("cartItems's name cant be empty"),
    check("cartItems.*.quantity")
      .not()
      .isEmpty()
      .withMessage("cartItems's quantity cant be empty"),

    check("restaurantId")
      .not()
      .isEmpty()
      .withMessage("restaurantId cant be empty"),
    check("deliveryDetails.name")
      .not()
      .isEmpty()
      .withMessage("name cant be empty"),

    check("deliveryDetails.city")
      .not()
      .isEmpty()
      .withMessage("city cant be empty"),
    check("deliveryDetails.country")
      .not()
      .isEmpty()
      .withMessage("country cant be empty"),
    check("deliveryDetails.addressLine1")
      .not()
      .isEmpty()
      .withMessage("addressLine1 cant be empty"),

    check("deliveryDetails.email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("email is invalid"),
  ];
};

const stripeWebhookHandlerValidator = () => {
  return [
    check("orderId").not().isEmpty().withMessage("orderId cant be empty"),
    check("totalPrice").not().isEmpty().withMessage("totalPrice cant be empty"),
  ];
};


export default {
  createCheckoutSessionValidator,
  stripeWebhookHandlerValidator,
};
