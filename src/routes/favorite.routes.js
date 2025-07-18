import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import {
  getRecipesByUser,
  createDeleteFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.get("/", protectRoute, getRecipesByUser);
router.put("/:id", protectRoute, createDeleteFavorite);

export default router;
