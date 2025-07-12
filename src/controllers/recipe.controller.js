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

    // Sort by createdAt and favoriteCount descending
    // pagination
    const recipes = await Recipe.find()
      .sort({ createdAt: -1, favoriteCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username avatar")
      .populate("categories")
      .lean();

    // get the favorite count for each recipe
    const enrichedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const [ratingStats, favoritesCount] = await Promise.all([
          Rating.aggregate([
            { $match: { recipe: recipe._id } },
            {
              $group: {
                _id: "$recipe",
                averageRating: { $avg: "$value" },
              },
            },
          ]),
          Favorite.countDocuments({ recipe: recipe._id }),
        ]);

        return {
          ...recipe,
          averageRating: ratingStats[0]?.averageRating || 0,
          favoriteCount: favoritesCount,
        };
      })
    );

    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      recipes: enrichedRecipes,
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
      .populate("user", "username avatar")
      .populate("categories")
      .lean();

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // get rating of the recipe and the favorite count
    const [ratingStats, favoritesCount] = await Promise.all([
      Rating.aggregate([
        { $match: { recipe: id } },
        {
          $group: {
            _id: "$recipe",
            averageRating: { $avg: "$value" },
          },
        },
      ]),
      Favorite.countDocuments({ recipe: id }),
    ]);

    recipe.averageRating = ratingStats[0]?.averageRating || 0;
    recipe.favoriteCount = favoritesCount;

    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Error getting recipe" });
  }
};

export const getRecipesByUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // get favorite recipes
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "recipe",
        populate: [
          {
            path: "user",
            select: "username avatar",
          },
          {
            path: "categories",
          },
        ],
      })
      .lean();

    // filter out recipes that are not saved or were deleted
    const recipes = favorites.map((fav) => fav.recipe).filter(Boolean);

    // get favorites count
    const favoritesCount = await Favorite.aggregate([
      {
        $group: {
          _id: "$recipe",
          totalFavorites: { $sum: 1 },
        },
      },
    ]);

    // add favorites count to each recipe
    const favoritesWithCounts = recipes.map((recipe) => {
      const count =
        favoritesCount.find(
          (fav) => fav._id.toString() === recipe._id.toString()
        )?.totalFavorites || 0;

      return {
        ...recipe,
        favorites: count,
      };
    });

    res.status(200).json({ recipes: favoritesWithCounts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting recipes" });
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
      try {
        const imageId = recipe.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      } catch (deleteError) {
        console.log("Error deleting cloudinary image: ", deleteError);
      }
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
      image,
      title,
      description,
      ingredients,
      steps,
      totalTime,
      categories,
    } = req.body;

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

    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (err) {
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
