import expressValidator from "express-validator";

const check = expressValidator.check;

const loginValidator = () => {
  return [
    check("email").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

export default {
  loginValidator,
};
