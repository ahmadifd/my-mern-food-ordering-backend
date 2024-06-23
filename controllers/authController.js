import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import controller from "../routes/controller.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const accessToken = jwt.sign(
    {
      UserAuthInfo: {
        email: foundUser.email,
        roles: foundUser.roles,
      },
    },
    process.env.accessTokenPrivateKey,
    { expiresIn: "500s" }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.refreshTokenPrivateKey,
    { expiresIn: "1d" }
  );
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 1 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(200).json({
    data: { accessToken },
  });
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({
      message: "Unauthorized - jwt cookies does'nt exist",
    });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.refreshTokenPrivateKey,
    async (err, decode) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ refreshToken }).exec();

      if (!foundUser || foundUser.email !== decode.email)
        return res.status(403).json({
          message: "Forbidden",
        });

      const accessToken = jwt.sign(
        {
          UserAuthInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.accessTokenPrivateKey,
        { expiresIn: "500s" }
      );

      res.status(200).json({
        data: { accessToken },
      });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({});
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: false,
      //sameSite: 'None',
      secure: false,
    });
    return res.status(204).json({});
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", {
    httpOnly: false,
    //sameSite: 'None',
    secure: false,
  });

  res.send({ message: "Cookie cleared" });
};

export default { login, refresh, logout };
