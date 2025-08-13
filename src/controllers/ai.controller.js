import {
  generateJSONFromIdea,
  generateJSONWithOCROption,
  generateRecipeFromImage,
} from "../lib/aiProcess.js";
import Category from "../models/category.model.js";

const getJSON = (string) => {
  const match = string.match(/```json\s*([\s\S]+?)\s*```/);

  if (!match) {
    return null;
  }

  return JSON.parse(match[1]);
};

export const processWithOCR = async (req, res) => {
  try {
    const { imageBase64, imageType } = req.body;

    if (!imageBase64 || !imageType) {
      return res.status(400).json({ error: "Error getting data from image" });
    }

    // get categories
    const categories = await Category.find();

    // create categories string for AI
    const categoriesString = categories.map((c) => c.name).join(", ");

    // process text with AI
    const responseText = await generateJSONWithOCROption(
      imageBase64,
      imageType,
      categoriesString
    );

    if (!responseText) {
      return res.status(400).json({ error: "Error getting data with AI" });
    }

    // parse response to get the JSON
    const recipeData = getJSON(responseText);

    if (!recipeData)
      return res.status(400).json({ error: "Error getting data with AI" });

    // get categories ids
    const ids = await getCategoriesIds(recipeData.categories, categories);
    recipeData.categories = ids;

    res.status(200).json({ recipe: recipeData });
  } catch (err) {
    res.status(500).json({ error: "Error getting data with AI" });
  }
};

export const processWithNewIdea = async (req, res) => {
  try {
    const { title, description } = req.body;

    // get categories
    const categories = await Category.find();
    const categoriesString = categories
      .map((category) => category.name)
      .join(", ");

    // process text with AI
    const responseText = await generateJSONFromIdea(
      title,
      description,
      categoriesString
    );

    if (!responseText) {
      return res.status(400).json({ error: "Error getting data with AI" });
    }

    const recipeData = getJSON(responseText);

    if (!recipeData)
      return res.status(400).json({ error: "Error getting data with AI" });

    // get categories ids
    const ids = await getCategoriesIds(recipeData.categories, categories);
    recipeData.categories = ids;

    res.status(200).json({ recipe: recipeData });
  } catch (err) {
    res.status(500).json({ error: "Error getting data with AI" });
  }
};

export const processWithImage = async (req, res) => {
  try {
    const { imageBase64, imageType } = req.body;

    if (!imageBase64 || !imageType) {
      return res.status(400).json({ error: "Error getting data from image" });
    }

    // get categories
    const categories = await Category.find();

    // create categories string for AI
    const categoriesString = categories.map((c) => c.name).join(", ");

    // process text with AI
    const responseText = await generateRecipeFromImage(
      imageBase64,
      imageType,
      categoriesString
    );

    if (!responseText) {
      return res.status(400).json({ error: "Error getting data with AI" });
    }

    // parse response to get the JSON
    const recipeData = getJSON(responseText);

    if (!recipeData)
      return res.status(400).json({ error: "Error getting data with AI" });

    // get categories ids
    const ids = await getCategoriesIds(recipeData.categories, categories);
    recipeData.categories = ids;

    res.status(200).json({ recipe: recipeData });
  } catch (err) {
    res.status(500).json({ error: "Error getting data with AI" });
  }
};

const getCategoriesIds = async (names, categories) => {
  return names.map((name) => categories.find((c) => c.name === name)._id);
};
