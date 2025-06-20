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
  title: z.string({
    required_error: "El título es obligatorio",
  }).min(1),
  description: z.string({
    required_error: "La descripción es obligatoria",
  }).min(1),
  ingredients: z.array(ingredientSchema).nonempty({
    message: "Debe ingresar al menos un ingrediente",
  }),
  steps: z.array(stepSchema).nonempty({
    message: "Debe ingresar al menos un paso",
  }),
  totalTime: z.number({
    required_error: "El tiempo total es obligatorio",
  }).int().positive(),
  categories: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos una categoría",
  }), // IDs válidos de Mongo
});
