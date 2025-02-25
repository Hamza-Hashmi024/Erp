const express = require('express');
const router = express.Router();
const productController = require('../Controllers/InventryControllers/Product');
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');

// Create a new product
router.post('/products',authMiddleware, authorize(['create_products']), productController.createProduct);

// Get all products
router.get('/products', authMiddleware, authorize(['read_products']), productController.getAllProducts);

// Get a product by ID
router.get('/products/:id', authMiddleware, authorize(['read_products']), productController.getProductById);

// Update a product
router.put('/products/:id', authMiddleware, authorize(['update_products']), productController.updateProduct);

// Delete a product
router.delete('/products/:id', authMiddleware, authorize(['delete_products']), productController.deleteProduct);

module.exports = router; 
