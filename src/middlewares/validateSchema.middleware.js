import { ZodError } from "zod";

const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      }));

      return res
        .status(400)
        .json({ error: "Invalid data", formErrors: formattedErrors });
    }

    return res.status(400).json({ error: "Error al validar el formulario." });
  }
};

export default validateSchema;
