import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    totalTime: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [ingredientSchema],
      required: true,
    },
    steps: {
      type: [stepSchema],
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
