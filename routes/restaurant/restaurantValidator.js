import expressValidator, { param } from "express-validator";

const check = expressValidator.check;

const searchRestaurantValidator = () => {
  const name = "asdas";
  return [
    param("city")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("City paramenter must be a valid string"),
  ];
};

export default {
  searchRestaurantValidator,
};
