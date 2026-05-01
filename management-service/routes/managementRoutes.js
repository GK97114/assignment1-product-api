const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/managementController');

// Define routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
