import expressValidator from "express-validator";

const check = expressValidator.check;

const loginValidator = () => {
  return [
    check("email")
      .isEmpty()
      .withMessage("email cant be empty")
      .isEmail()
      .withMessage("email is invalid"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

export default {
  loginValidator,
};
