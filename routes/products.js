import express from "express";
import { v4 as uuidv4 } from "uuid";
import { ValidationError, NotFoundError } from "../errors/index.js";

const router = express.Router();

// In-memory product data
let products = [
  { id: uuidv4(), name: "Book A", description: "Inspiring novel", price: 12.99, category: "Books", inStock: true },
  { id: uuidv4(), name: "Laptop", description: "Lightweight laptop", price: 899.99, category: "Electronics", inStock: true },
  { id: uuidv4(), name: "Desk Lamp", description: "LED lamp", price: 25.5, category: "Home", inStock: true },
];

// GET all (supports filter, pagination, search)
router.get("/", (req, res) => {
  let { category, name, page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filtered = products;
  if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (name) filtered = filtered.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));

  const start = (page - 1) * limit;
  const end = start + limit;
  res.json({ total: filtered.length, page, limit, data: filtered.slice(start, end) });
});

// GET by ID
router.get("/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json(product);
});

// POST create
router.post("/", (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !price || !category) return next(new ValidationError("Missing required fields"));
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update
router.put("/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE
router.delete("/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));
  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", product: deleted[0] });
});

// GET stats
router.get("/stats/category", (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

export default router;
