import Favorite from "../models/favorite.model.js";
import Recipe from "../models/recipe.model.js";

export const getRecipesByUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const { title, categories } = req.query;

    const filters = {
      user: userId,
    };

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

    // search for favorite recipes by user
    const favorites = await Favorite.find(filters)
      .populate({
        path: "recipe",
        populate: [
          { path: "user", select: "username avatar" },
          { path: "categories" },
        ],
      })
      .lean();

    // filter out recipes that are not saved or were deleted and add favorites count
    const recipes = favorites
      .map((fav) => fav.recipe)
      .filter(Boolean)
      .map((recipe) => ({
        ...recipe,
        favoritesCount: recipe.favoriteCount || 0, // usar el campo almacenado
      }));

    res.status(200).json({ recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting recipes" });
  }
};

export const createDeleteFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // if the user is the owner of the recipe, then return an error with a message
    if (recipe.user.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ error: "You can't mark your own recipe as favorite" });
    }

    // Check if the recipe is already favorited
    const favorite = await Favorite.findOne({
      user: userId,
      recipe: recipeId,
    });

    // check if the favorite was created
    if (favorite) {
      // Remove favorite
      await Favorite.deleteOne({ _id: favorite._id });
      await Recipe.updateOne(
        { _id: recipeId, favoriteCount: { $gt: 0 } },
        { $inc: { favoriteCount: -1 } }
      );

      return res
        .status(200)
        .json({ message: "Recipe unfavorited successfully" });
    } else {
      // Add favorite only if not exists
      await Favorite.create({ user: userId, recipe: recipeId });
      await Recipe.updateOne({ _id: recipeId }, { $inc: { favoriteCount: 1 } });

      return res.status(200).json({ message: "Recipe favorited successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error favoriting recipe" });
  }
};
