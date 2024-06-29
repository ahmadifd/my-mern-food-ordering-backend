import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { email, name, addressLine1, city, country, roles, password } =
    req.body;
  const duplicate = await User.findOne({ email });
  if (duplicate) {
    return res.status(409).json({
      message: "duplicate email",
    });
  }

  console.log(email, name, addressLine1, city, country, roles, password);

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = {
    name,
    email,
    addressLine1,
    city,
    country,
    password: hashedPwd,
    roles: !Array.isArray(roles) || !roles.length ? [] : roles,
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

const editUser = async (req, res) => {
  const { email, name, addressLine1, city, country, roles, password, active } =
    req.body;

  if (req?.params?.id === undefined)
    return res.status(400).json({
      message: "Error id",
    });
  const id = req?.params?.id;

  // Does the user exist to update?
  const user = await User.findOne({ _id: id });

  if (!user) {
    return controller.response({ res, status: 400, message: "User not found" });
  }

  user.name = name;
  user.email = email;
  user.addressLine1 = addressLine1;
  user.city = city;
  user.country = country;
  user.roles = !Array.isArray(roles) || !roles.length ? [] : roles;
  if (active) user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.status(201).json({
    message: `${updatedUser.userName} updated`,
    data: updatedUser,
  });
};

const getUser = async (req, res) => {
  if (req?.params?.email === undefined)
    return res.status(400).json({
      message: "Error email",
    });
  const email = req?.params?.email;
  const findUser = await User.findOne({ email }).select(
    "-password -refreshToken"
  );
  if (!findUser) {
    return res.status(204).json({
      message: `No User matches Email ${email}.`,
    });
  }
  res.status(200).json({
    data: findUser,
  });
};

export default { register, editUser, getUser };
