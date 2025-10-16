import { ValidationError } from "../errors/index.js";

export const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return next(new ValidationError("Missing required fields"));
  }
  next();
};
