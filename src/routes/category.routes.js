import express from "express";
import Category from "../models/category.model.js";

const router = express.Router();

router.get("/", (req, res) => {
  const categories = Category.find();

  res.status(200).json(categories);
});

export default router;
