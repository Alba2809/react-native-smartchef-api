import Category from "../models/category.model.js";

const insertCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const categories = [
    "postre",
    "desayuno",
    "almuerzo",
    "cena",
    "vegano",
    "vegetariano",
    "rápido",
    "saludable",
  ];

  for (const category of categories) {
    const newCategory = new Category({
      name: category,
    });

    await newCategory.save();
  }

  console.log("Categories inserted successfully");
};

export default insertCategories;
