import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import {
  getRecipes,
  getRecipe,
  addRecipe,
  deleteRecipe,
  getRecipesByUser,
} from "../controllers/recipe.controller.js";
import { createRecipeSchema } from "../validations/recipe.validation.js";

const router = express.Router();

router.get("/", protectRoute, getRecipes);
router.get("/user", protectRoute, getRecipesByUser);
router.get("/:id", protectRoute, getRecipe);
router.delete("/:id", protectRoute, deleteRecipe);
router.post("/", protectRoute, validateSchema(createRecipeSchema), addRecipe);

export default router;
