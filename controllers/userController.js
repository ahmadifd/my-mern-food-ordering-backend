import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { email, name, addressLine1, city, country, roles , password } = req.body;
  const duplicate = await User.findOne({ email });
  if (duplicate) {
    return res.status(409).json({
      message: "duplicate email",
    });
  }

  console.log(email, name, addressLine1, city, country, roles , password );

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { name, email, addressLine1, city, country, password: hashedPwd }
      : {
          name,
          email,
          addressLine1,
          city,
          country,
          password: hashedPwd,
          roles,
        };

  try {
    const user = await User.create(userObject);
    res.status(201).json({
      message: `New user ${email} created`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export default { register };
