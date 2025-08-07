import mongoose from "mongoose";
import { generateJSONGeminai } from "../lib/aiProcess.js";
import cloudinary from "../lib/cloudinary.js";
import Favorite from "../models/favorite.model.js";
import Rating from "../models/rating.model.js";
import Recipe from "../models/recipe.model.js";

export const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { title, categories } = req.query;

    const filters = {};

    // search by title with case insensitive
    if (title?.trim()) {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    // search by categories
    if (categories) {
      filters.categories = {
        $in: Array.isArray(categories) ? categories : [categories],
      };
    }

    // Sort by createdAt and favoriteCount descending
    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find(filters)
        .sort({ createdAt: -1, favoriteCount: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username avatar -_id")
        .populate("categories", "name _id")
        .lean(),
      Recipe.countDocuments(filters),
    ]);

    // indicate if the user have favorited the recipe
    const recipeIds = recipes.map((r) => r._id);

    const favorites = await Favorite.find({
      user: req.user._id,
      recipe: { $in: recipeIds },
    }).select("recipe");

    const favoriteIds = new Set(favorites.map((f) => f.recipe.toString()));

    const recipesWithFavorite = recipes.map((recipe) => ({
      ...recipe,
      isFavorite: favoriteIds.has(recipe._id.toString()),
    }));

    res.status(200).json({
      recipes: recipesWithFavorite,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    });
  } catch (err) {
    res.status(500).json({ error: "Error getting recipes" });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const id = req.params.id;

    const recipe = await Recipe.findById(id)
      .populate("user", "username avatar -_id")
      .populate("categories", "name _id")
      .lean();

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // get if the user have favorited the recipe
    const favorite = await Favorite.findOne({
      user: req.user._id,
      recipe: recipe._id,
    });

    recipe.isFavorite = favorite ? true : false;

    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Error getting recipe" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this recipe" });
    }

    //delete cloudinary image
    if (recipe.image && recipe.image.includes("cloudinary")) {
      const imageId = recipe.image.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(imageId);
    }

    // delete recipe
    await recipe.deleteOne();

    // delete ratings and favorites
    await Rating.deleteMany({ recipe: recipe._id });
    await Favorite.deleteMany({ recipe: recipe._id });

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting recipe" });
  }
};

export const addRecipe = async (req, res) => {
  try {
    const user = req.user._id;
    const {
      clientId,
      image,
      title,
      description,
      ingredients,
      steps,
      totalTime,
      categories,
    } = req.body;

    // if the recipe already exists, return an error message
    const isValidId = mongoose.isValidObjectId(clientId.toString());
    if (clientId && isValidId) {
      const recipe = await Recipe.findOne({
        _id: clientId.toString(),
      });

      if (recipe) {
        return res
          .status(400)
          .json({ error: "Ya ha sido publicada esta receta" });
      }
    }

    // upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // create recipe
    const newRecipe = new Recipe({
      image: imageUrl,
      title,
      description,
      ingredients,
      steps,
      totalTime,
      categories,
      user,
    });

    await newRecipe.save();

    console.log("new recipe", newRecipe._id);

    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding recipe" });
  }
};

export const processTextAI = async (req, res) => {
  try {
    const { rawText } = req.body;

    const responseText = await generateJSONGeminai(rawText);

    const match = responseText.match(/```json\s*([\s\S]+?)\s*```/);

    if (!match) {
      console.warn("⚠️ No se encontró bloque JSON en la respuesta");
      return res.status(400).json({ error: "Error getting data with AI" });
    }

    const recipeData = JSON.parse(match[1]);

    res.status(200).json({ recipeData });
  } catch (err) {
    res.status(500).json({ error: "Error getting data with AI" });
  }
};
