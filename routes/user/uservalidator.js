import expressValidator from "express-validator";

const check = expressValidator.check;

const registerValidator = () => {
  return [
    check("email").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("name").not().isEmpty().withMessage("name cant be empty"),
    check("addressLine1")
      .not()
      .isEmpty()
      .withMessage("addressLine1 cant be empty"),
    check("city").not().isEmpty().withMessage("city cant be empty"),
    check("country").not().isEmpty().withMessage("country cant be empty"),
    check("roles").not().isEmpty().withMessage("roles cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

export default {
  registerValidator,
};
