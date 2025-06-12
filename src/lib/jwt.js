import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const generateToken = (userID) => {
  return jwt.sign({ userID }, TOKEN_SECRET, {
    expiresIn: "15d",
  });
};
