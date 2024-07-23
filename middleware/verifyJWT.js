import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "" });
    req.userId = decoded.data.userId;
    req.email = decoded.data.email;
    req.roles = decoded.data.roles;

    next();
  });
};
