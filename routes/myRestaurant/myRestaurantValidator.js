import expressValidator, { checkSchema, body } from "express-validator";

const check = expressValidator.check;

const createRestaurantValidator = () => {
  const name = "asdas";
  return [
    //name.not().isEmpty().withMessage("name1111 cant be empty"),

    checkSchema({
      imageFile: {
        custom: {
          options: (value, { req, path }) =>
            !!req.files[path] &&
            ["image/jpeg", "image/jpg", "image/png"].includes(
              req.files[path][0].mimetype
            ),
          errorMessage: "You should upload an imageFile",
        },
      },
    }),
    check("restaurantName")
      .not()
      .isEmpty()
      .withMessage("restaurantName cant be empty"),
    check("city").not().isEmpty().withMessage("city cant be empty"),
    check("country").not().isEmpty().withMessage("country cant be empty"),
    check("deliveryPrice")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("deliveryPrice cant be empty"),
    check("estimatedDeliveryTime")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("estimatedDeliveryTime cant be empty"),
    check("cuisines").isArray({ min: 1 }).withMessage("cuisines cant be empty"),
    check("menuItems").isArray({ min: 1 }).withMessage("menu cant be empty"),
    check("menuItems.*.name")
      .not()
      .isEmpty()
      .withMessage("menu's name cant be empty"),
    check("menuItems.*.price")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("menu's price cant be empty"),
  ];
};

const editRestaurantValidator = () => {
  const name = "asdas";
  return [
    checkSchema({
      imageFile: {
        custom: {
          options: (value, { req, path }) =>
            !!req.files[path]
              ? ["image/jpeg", "image/jpg", "image/png"].includes(
                  req.files[path][0].mimetype
                )
              : true,

          errorMessage: "You should upload an imageFile",
        },
      },
    }),
    check("restaurantName")
      .not()
      .isEmpty()
      .withMessage("restaurantName cant be empty"),
    check("city").not().isEmpty().withMessage("city cant be empty"),
    check("country").not().isEmpty().withMessage("country cant be empty"),
    check("deliveryPrice")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("deliveryPrice cant be empty"),
    check("estimatedDeliveryTime")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("estimatedDeliveryTime cant be empty"),
    check("cuisines").isArray({ min: 1 }).withMessage("cuisines cant be empty"),
    check("menuItems").isArray({ min: 1 }).withMessage("menu cant be empty"),
    check("menuItems.*.name")
      .not()
      .isEmpty()
      .withMessage("menu's name cant be empty"),
    check("menuItems.*.price")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("menu's price cant be empty"),
  ];
};

export default {
  createRestaurantValidator,
  editRestaurantValidator,
};
