import express from "express";
import Category from "../models/category.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().select("-__v");;

    res.status(200).json({ categories }); 
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
});

export default router;
