// Import dependancies
const express = require("express");
const app = express();

// Load environment variables from .env file
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(express.json()); // For parsing application/json

// Middleware to add replica ID to response locals
app.use((req, res, next) => {
  res.locals.replicaId = process.env.RAILWAY_REPLICA_ID || "replica-unknown";
  next();
});

// Routes
app.use("/api/products", productRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Product API!" });
});

// Port configuration
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});