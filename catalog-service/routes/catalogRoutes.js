const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllProducts,
  getProductById,
} = require('../controller/catalogController');

// Define routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
