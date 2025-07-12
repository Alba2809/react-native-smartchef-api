import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

const protectRoute = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized, login to access this resource" });
  }

  try {
    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      const { userID } = decoded;

      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized, login to access this resource" });
      }

      if (!userID) {
        return res
          .status(401)
          .json({ error: "Unauthorized, login to access this resource" });
      }

      const user = await User.findById(userID).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized, login to access this resource" });
      }

      req.user = user;

      next();
    });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Unauthorized, login to access this resource" });
  }
};

export default protectRoute;
