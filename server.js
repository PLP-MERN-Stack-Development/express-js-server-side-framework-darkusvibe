// server.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { logger } = require("./middleware/logger.js");
const { authenticate } = require("./middleware/auth.js");
const { globalErrorHandler } = require("./errors/GlobalErrorHandler.js");
const productRoutes = require("./routes/products.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use("/api/products", authenticate, productRoutes);

// Error handling
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
