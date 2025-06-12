import express from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { login, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/login", validateSchema(loginSchema), login);

/* router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ messages: ["Logged out successfully"] });
}); */

export default router;
