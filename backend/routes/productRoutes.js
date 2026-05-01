const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllProducts,
  createProduct,
} = require('../controller/productController');

// Define routes
router.get('/', getAllProducts);
router.post('/', createProduct);

module.exports = router;