import z from "zod";

export const stepSchema = z.object({
  number: z.number().int().nonnegative(),
  text: z.string().min(1),
  duration: z.number().int().nonnegative().optional(),
});

export const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string().min(1),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ingredients: z.array(ingredientSchema).nonempty(),
  steps: z.array(stepSchema).nonempty(),
  totalTime: z.number().int().positive(),
  categories: z.array(z.string()).nonempty(), // IDs válidos de Mongo
});
